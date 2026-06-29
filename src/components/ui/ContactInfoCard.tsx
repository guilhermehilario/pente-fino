import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cards, texts } from '../../globalStyle';

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
    <div className={cards.contactInfoCard}>
      <h2 className={texts.h2Section}>
        {headerIcon} Contato e Localização
      </h2>
      <div className="space-y-6">
        <div className="flex items-start gap-4">
          <div className={cards.contactIconWrapper}>
            <EmailIcon size={20} />
          </div>
          <div>
            <p className={texts.contactLabel}>{emailLabel}</p>
            <p className={texts.contactValue}>{email}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className={cards.contactIconWrapper}>
            <PhoneIcon size={20} />
          </div>
          <div>
            <p className={texts.contactLabel}>{phoneLabel}</p>
            <p className={texts.contactValue}>{phone}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className={cards.contactIconWrapper}>
            <AddressIcon size={20} />
          </div>
          <div>
            <p className={texts.contactLabel}>{addressLabel}</p>
            <p className={texts.contactValueLong}>{address}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
