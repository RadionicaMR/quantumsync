import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    // Verify caller is authenticated
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token)
    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { referralCode, customerEmail, customerName } = await req.json()

    if (!referralCode || !customerEmail) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Look up affiliate server-side
    const { data: affiliate } = await supabaseAdmin
      .from('affiliates')
      .select('id, commission_rate, total_sales, total_commissions, pending_commissions')
      .eq('affiliate_code', referralCode)
      .eq('status', 'active')
      .maybeSingle()

    if (!affiliate) {
      return new Response(JSON.stringify({ message: 'No active affiliate found' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Get default product server-side
    const { data: defaultProduct } = await supabaseAdmin
      .from('products')
      .select('id, price_usd')
      .eq('active', true)
      .limit(1)
      .maybeSingle()

    if (!defaultProduct) {
      return new Response(JSON.stringify({ message: 'No active product found' }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Calculate commission server-side
    const saleAmount = defaultProduct.price_usd || 0
    const commissionAmount = saleAmount * ((affiliate.commission_rate || 50) / 100)

    // Insert sale record
    const { error: saleError } = await supabaseAdmin.from('affiliate_sales').insert({
      affiliate_id: affiliate.id,
      product_id: defaultProduct.id,
      customer_email: customerEmail,
      customer_name: customerName || null,
      sale_amount: saleAmount,
      currency: 'USD',
      commission_amount: commissionAmount,
      commission_status: 'pending',
      payment_method: 'paypal'
    })

    if (saleError) {
      console.error('Sale insert error:', saleError)
      return new Response(JSON.stringify({ error: 'Failed to track sale' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Update affiliate totals
    await supabaseAdmin
      .from('affiliates')
      .update({
        total_sales: (affiliate.total_sales || 0) + 1,
        total_commissions: (affiliate.total_commissions || 0) + commissionAmount,
        pending_commissions: (affiliate.pending_commissions || 0) + commissionAmount
      })
      .eq('id', affiliate.id)

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
