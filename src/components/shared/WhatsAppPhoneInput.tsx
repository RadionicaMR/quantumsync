import { useMemo } from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Phone } from 'lucide-react';

export const COUNTRY_CODES = [
  { code: '+54', flag: '🇦🇷', name: 'Argentina' },
  { code: '+52', flag: '🇲🇽', name: 'México' },
  { code: '+34', flag: '🇪🇸', name: 'España' },
  { code: '+57', flag: '🇨🇴', name: 'Colombia' },
  { code: '+56', flag: '🇨🇱', name: 'Chile' },
  { code: '+51', flag: '🇵🇪', name: 'Perú' },
  { code: '+598', flag: '🇺🇾', name: 'Uruguay' },
  { code: '+595', flag: '🇵🇾', name: 'Paraguay' },
  { code: '+591', flag: '🇧🇴', name: 'Bolivia' },
  { code: '+593', flag: '🇪🇨', name: 'Ecuador' },
  { code: '+58', flag: '🇻🇪', name: 'Venezuela' },
  { code: '+55', flag: '🇧🇷', name: 'Brasil' },
  { code: '+506', flag: '🇨🇷', name: 'Costa Rica' },
  { code: '+507', flag: '🇵🇦', name: 'Panamá' },
  { code: '+502', flag: '🇬🇹', name: 'Guatemala' },
  { code: '+503', flag: '🇸🇻', name: 'El Salvador' },
  { code: '+504', flag: '🇭🇳', name: 'Honduras' },
  { code: '+505', flag: '🇳🇮', name: 'Nicaragua' },
  { code: '+809', flag: '🇩🇴', name: 'Rep. Dominicana' },
  { code: '+1', flag: '🇺🇸', name: 'EE.UU. / Canadá' },
  { code: '+44', flag: '🇬🇧', name: 'Reino Unido' },
  { code: '+39', flag: '🇮🇹', name: 'Italia' },
  { code: '+33', flag: '🇫🇷', name: 'Francia' },
  { code: '+49', flag: '🇩🇪', name: 'Alemania' },
  { code: '+351', flag: '🇵🇹', name: 'Portugal' },
];

export const DEFAULT_COUNTRY_CODE = '+54';

/** Validates an E.164-ish string like +542945581188 */
export const isValidWhatsappPhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return /^\+\d{8,17}$/.test(value) && digits.length >= 8 && digits.length <= 17;
};

interface WhatsAppPhoneInputProps {
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  phone: string;
  onPhoneChange: (phone: string) => void;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}

const WhatsAppPhoneInput = ({
  countryCode,
  onCountryCodeChange,
  phone,
  onPhoneChange,
  placeholder = '2945581188',
  disabled,
  id,
}: WhatsAppPhoneInputProps) => {
  const options = useMemo(() => COUNTRY_CODES, []);

  return (
    <div className="flex gap-2">
      <Select value={countryCode} onValueChange={onCountryCodeChange} disabled={disabled}>
        <SelectTrigger className="w-[130px] shrink-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-64">
          {options.map((c) => (
            <SelectItem key={`${c.code}-${c.name}`} value={c.code}>
              <span className="mr-1">{c.flag}</span> {c.code}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="relative flex-1">
        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-5 w-5" />
        <Input
          id={id}
          type="tel"
          inputMode="numeric"
          className="pl-10"
          placeholder={placeholder}
          value={phone}
          disabled={disabled}
          maxLength={15}
          onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, ''))}
        />
      </div>
    </div>
  );
};

export default WhatsAppPhoneInput;
