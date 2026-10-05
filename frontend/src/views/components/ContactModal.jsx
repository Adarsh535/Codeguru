'use client';

import React, { useEffect, useState } from 'react';
import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import PhoneIcon from '@mui/icons-material/Phone';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import EmailIcon from '@mui/icons-material/Email';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';
import FacebookIcon from '@mui/icons-material/Facebook';
import CloseIcon from '@mui/icons-material/Close';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

export default function ContactModal({ isOpen, onClose }) {
  const [renderModal, setRenderModal] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setRenderModal(true);
      setIsClosing(false);
    } else if (renderModal) {
      setIsClosing(true);
      const timer = setTimeout(() => {
        setRenderModal(false);
        setIsClosing(false);
      }, 260);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && renderModal && !isClosing) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [renderModal, isClosing]);

  if (!renderModal) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 260);
  };

  const contactOptions = [
    {
      id: 'call',
      name: 'Direct Call',
      subtitle: '+91 98765 43210',
      icon: PhoneIcon,
      bgColor: 'bg-emerald-500',
      actionText: 'CALL NOW',
      actionStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white',
      link: 'tel:+919876543210'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Support',
      subtitle: 'Instant Chat Helper',
      icon: WhatsAppIcon,
      bgColor: 'bg-emerald-600',
      actionText: 'CHAT NOW',
      actionStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white',
      link: 'https://wa.me/919876543210'
    },
    {
      id: 'email',
      name: 'Email Desk',
      subtitle: 'support@codeguru.com',
      icon: EmailIcon,
      bgColor: 'bg-rose-500',
      actionText: 'SEND MAIL',
      actionStyle: 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-600 hover:text-white',
      link: 'mailto:support@codeguru.com'
    },
    {
      id: 'telegram',
      name: 'Telegram Channel',
      subtitle: 'Latest Drive Updates',
      icon: TelegramIcon,
      bgColor: 'bg-sky-500',
      actionText: 'JOIN GROUP',
      actionStyle: 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-500 hover:text-white',
      link: 'https://t.me'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      subtitle: '@codeguru_official',
      icon: InstagramIcon,
      bgColor: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600',
      actionText: 'FOLLOW US',
      actionStyle: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-600 hover:text-white',
      link: 'https://instagram.com'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      subtitle: 'CodeGuru Network',
      icon: LinkedInIcon,
      bgColor: 'bg-blue-600',
      actionText: 'CONNECT',
      actionStyle: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white',
      link: 'https://linkedin.com'
    },
    {
      id: 'twitter',
      name: 'Twitter (X)',
      subtitle: '@codeguru_app',
      icon: TwitterIcon,
      bgColor: 'bg-slate-900',
      actionText: 'FOLLOW',
      actionStyle: 'bg-slate-100 text-slate-800 border-slate-300 hover:bg-slate-900 hover:text-white',
      link: 'https://twitter.com'
    },
    {
      id: 'facebook',
      name: 'Facebook Page',
      subtitle: 'Placement Updates',
      icon: FacebookIcon,
      bgColor: 'bg-indigo-600',
      actionText: 'LIKE PAGE',
      actionStyle: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-600 hover:text-white',
      link: 'https://facebook.com'
    }
  ];

  return (
    <div
      onClick={handleClose}
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/70 backdrop-blur-md select-none transition-all duration-300 ${
        isClosing ? 'animate-backdrop-out' : 'animate-backdrop-in'
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-full sm:max-w-md min-w-[280px] max-h-[92vh] sm:max-h-[88vh] bg-white rounded-t-[28px] sm:rounded-[32px] overflow-hidden border border-amber-300/80 shadow-[0_-10px_40px_rgba(245,158,11,0.15)] sm:shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex flex-col transition-all duration-300 transform ${
          isClosing ? 'animate-modal-slide-down' : 'animate-modal-slide-up'
        }`}
      >
        {/* Sticky Header Container (Handle + Title + Close) */}
        <div className="sticky top-0 z-20 bg-white/98 backdrop-blur-md px-4 pt-2.5 pb-3 border-b border-amber-100/90 shrink-0">
          {/* Top Pull Handle Indicator */}
          <div className="pb-2 flex justify-center cursor-pointer" onClick={handleClose}>
            <div className="w-12 h-1.5 bg-amber-400 hover:bg-amber-500 rounded-full transition-colors shadow-xs" />
          </div>

          {/* Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-amber-400/90 bg-amber-50/50 flex items-center justify-center shrink-0 shadow-2xs">
                <PhoneInTalkIcon className="!w-5 !h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 font-heading tracking-tight flex items-center gap-2">
                  Connect with CodeGuru
                  <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 rounded-full border border-amber-300/90 shadow-2xs">
                    24/7
                  </span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5 font-medium">Select a channel to get instant response</p>
              </div>
            </div>

            {/* Close Button */}
            <button
              suppressHydrationWarning
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-amber-100 flex items-center justify-center text-slate-600 hover:text-amber-900 transition-colors shadow-xs shrink-0 active:scale-90 cursor-pointer"
              title="Close modal"
            >
              <CloseIcon className="!w-4 !h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Single-Column Options List */}
        <div className="p-3 sm:p-4 flex flex-col gap-2 flex-1 overflow-y-auto no-scrollbar">
          {contactOptions.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <a
                key={item.id}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleClose}
                style={{ animationDelay: `${index * 30}ms` }}
                className="p-3 rounded-2xl bg-white hover:bg-amber-50/30 border border-slate-200/90 hover:border-amber-400 shadow-2xs hover:shadow-xs flex items-center justify-between transition-all duration-200 group text-left active:scale-[0.98]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-10 h-10 rounded-full ${item.bgColor} text-white shrink-0 flex items-center justify-center shadow-xs transition-transform duration-200 group-hover:scale-105`}>
                    <IconComponent className="!w-5 !h-5" />
                  </div>
                  <div className="min-w-0 truncate">
                    <div className="text-xs sm:text-sm font-extrabold text-slate-900 truncate group-hover:text-amber-700 transition-colors">
                      {item.name}
                    </div>
                    <span className="text-[10px] sm:text-[11px] text-slate-500 truncate block font-medium mt-0.5">{item.subtitle}</span>
                  </div>
                </div>

                <span className={`px-3 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-wider rounded-full border transition-all duration-200 ${item.actionStyle} shrink-0 ml-2 flex items-center gap-0.5 shadow-2xs`}>
                  {item.actionText}
                  <ChevronRightIcon className="!w-3 !h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </a>
            );
          })}
        </div>

        {/* Footer Hint */}
        <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
          <span className="flex items-center gap-1.5 font-bold text-emerald-700">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>Agents Available Online</span>
          </span>
          <span className="text-slate-400 font-medium">Tap anywhere to close</span>
        </div>
      </div>
    </div>
  );
}
