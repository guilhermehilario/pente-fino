import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface ContactInfoCardProps {
  email: string;
  phone: string;
  address: string;
  emailLabel?: string;
  phoneLabel?: string;
  addressLabel?: string;
  headerIcon?: React.ReactNode;
  EmailIcon?: LucideIcon;
  PhoneIcon?: LucideIcon;
  AddressIcon?: LucideIcon;
}

export function ContactInfoCard({
  email,
  phone,
  address,
  emailLabel = 'E-mail',
  phoneLabel = 'Telefone',
  addressLabel = 'Endereço',
  headerIcon = <MapPin className="text-blue-400" size={20} />,
  EmailIcon = Mail,
  PhoneIcon = Phone,
  AddressIcon = MapPin,
}: ContactInfoCardProps) {
  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-6 shadow-lg h-fit">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
        {headerIcon} Contato e Localização
      </h2>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-slate-700/50 rounded-lg text-slate-400">
            <EmailIcon size={20} />
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-0.5">{emailLabel}</p>
            <p className="text-slate-200 font-medium">{email}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-slate-700/50 rounded-lg text-slate-400">
            <PhoneIcon size={20} />
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-0.5">{phoneLabel}</p>
            <p className="text-slate-200 font-medium">{phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-slate-700/50 rounded-lg text-slate-400">
            <AddressIcon size={20} />
          </div>
          <div>
            <p className="text-sm text-slate-400 mb-0.5">{addressLabel}</p>
            <p className="text-slate-200 font-medium leading-relaxed">{address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
