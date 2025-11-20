import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Verify the caller is an admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Check if user is admin
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .single()

    if (roleError || roleData?.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required')
    }

    // Get the request body
    const { email, password, fullName } = await req.json()

    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters')
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format')
    }

    // Create the user using admin API
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: fullName || ''
      }
    })

    if (createError) {
      throw createError
    }

    // The profile and role should be created automatically by triggers
    // But we'll verify and create them if needed
    
    // Check if profile exists
    const { data: profileExists } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', newUser.user.id)
      .single()

    if (!profileExists) {
      // Create profile if it doesn't exist
      await supabaseAdmin
        .from('profiles')
        .insert({
          id: newUser.user.id,
          email: email,
          full_name: fullName || ''
        })
    }

    // Check if role exists
    const { data: roleExists } = await supabaseAdmin
      .from('user_roles')
      .select('id')
      .eq('user_id', newUser.user.id)
      .single()

    if (!roleExists) {
      // Create role if it doesn't exist
      await supabaseAdmin
        .from('user_roles')
        .insert({
          user_id: newUser.user.id,
          role: 'user'
        })
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'User created successfully',
        user: {
          id: newUser.user.id,
          email: newUser.user.email
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
