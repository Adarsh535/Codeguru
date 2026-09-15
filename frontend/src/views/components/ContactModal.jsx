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
      color: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25',
      actionText: 'Call Now',
      actionColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
      link: 'tel:+919876543210'
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp Support',
      subtitle: 'Instant Chat Helper',
      icon: WhatsAppIcon,
      color: 'bg-gradient-to-br from-emerald-600 to-green-700 text-white shadow-lg shadow-emerald-600/25',
      actionText: 'Chat Now',
      actionColor: 'bg-emerald-50 text-emerald-700 border-emerald-200 group-hover:bg-emerald-600 group-hover:text-white',
      link: 'https://wa.me/919876543210'
    },
    {
      id: 'email',
      name: 'Email Desk',
      subtitle: 'support@codeguru.com',
      icon: EmailIcon,
      color: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25',
      actionText: 'Send Mail',
      actionColor: 'bg-rose-50 text-rose-700 border-rose-200 group-hover:bg-rose-600 group-hover:text-white',
      link: 'mailto:support@codeguru.com'
    },
    {
      id: 'telegram',
      name: 'Telegram Channel',
      subtitle: 'Latest Drive Updates',
      icon: TelegramIcon,
      color: 'bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-lg shadow-sky-500/25',
      actionText: 'Join Group',
      actionColor: 'bg-sky-50 text-sky-700 border-sky-200 group-hover:bg-sky-500 group-hover:text-white',
      link: 'https://t.me'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      subtitle: '@codeguru_official',
      icon: InstagramIcon,
      color: 'bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-lg shadow-rose-500/25',
      actionText: 'Follow Us',
      actionColor: 'bg-purple-50 text-purple-700 border-purple-200 group-hover:bg-purple-600 group-hover:text-white',
      link: 'https://instagram.com'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      subtitle: 'CodeGuru Network',
      icon: LinkedInIcon,
      color: 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-lg shadow-blue-600/25',
      actionText: 'Connect',
      actionColor: 'bg-blue-50 text-blue-700 border-blue-200 group-hover:bg-blue-600 group-hover:text-white',
      link: 'https://linkedin.com'
    },
    {
      id: 'twitter',
      name: 'Twitter (X)',
      subtitle: '@codeguru_app',
      icon: TwitterIcon,
      color: 'bg-gradient-to-br from-slate-800 to-slate-950 text-white shadow-lg shadow-slate-900/25',
      actionText: 'Follow',
      actionColor: 'bg-slate-100 text-slate-800 border-slate-300 group-hover:bg-slate-900 group-hover:text-white',
      link: 'https://twitter.com'
    },
    {
      id: 'facebook',
      name: 'Facebook Page',
      subtitle: 'Placement Updates',
      icon: FacebookIcon,
      color: 'bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-600/25',
      actionText: 'Like Page',
      actionColor: 'bg-indigo-50 text-indigo-700 border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white',
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
        className={`w-full max-w-full sm:max-w-lg min-w-[280px] max-h-[90vh] sm:max-h-[85vh] bg-white rounded-t-[24px] xxs:rounded-t-[28px] sm:rounded-[32px] overflow-hidden border border-amber-300/80 shadow-[0_-10px_40px_rgba(245,158,11,0.2)] sm:shadow-[0_20px_60px_rgba(0,0,0,0.3)] flex flex-col transition-all duration-300 transform ${
          isClosing ? 'animate-modal-slide-down' : 'animate-modal-slide-up'
        }`}
      >
        {/* Sticky Header Container (Drag Handle + Title + Close Button) */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md px-3 xxs:px-4 pt-2 pb-2.5 border-b border-amber-100/80 shrink-0">
          {/* Top Drag / Pull Handle Bar Indicator */}
          <div className="pb-1.5 flex justify-center cursor-pointer" onClick={handleClose}>
            <div className="w-10 xxs:w-12 h-1.5 bg-amber-300 hover:bg-amber-400 rounded-full transition-all duration-200 shadow-xs" />
          </div>

          {/* Modal Header Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 xxs:gap-2.5">
              <div className="w-9 h-9 xxs:w-10 xxs:h-10 rounded-[14px] bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-sm flex items-center justify-center shrink-0">
                <div className="w-full h-full bg-white rounded-[12px] flex items-center justify-center">
                  <PhoneInTalkIcon className="!w-4 !h-4 xxs:!w-5 xxs:!h-5 text-amber-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xs xxs:text-sm sm:text-base font-extrabold text-slate-900 font-heading tracking-tight flex items-center gap-1.5">
                  Connect with CodeGuru
                  <span className="px-1.5 py-0.2 text-[8px] xxs:text-[9px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 rounded-full border border-amber-300">
                    24/7
                  </span>
                </h3>
                <p className="text-[10px] xxs:text-xs text-slate-500 mt-0.5">Select a channel to get instant response</p>
              </div>
            </div>

            {/* Prominent Close Button ("X") */}
            <button
              suppressHydrationWarning
              onClick={handleClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-amber-100 flex items-center justify-center text-slate-600 hover:text-amber-900 transition-colors shadow-xs shrink-0 active:scale-90"
              title="Close modal"
            >
              <CloseIcon className="!w-4 !h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Options List Container with Compact Spacing */}
        <div className="p-2.5 xxs:p-3.5 flex flex-col flex-1 overflow-y-auto no-scrollbar">
          {/* 8 Social & Contact Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 xxs:gap-2">
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
                  className="p-2.5 xxs:p-3 rounded-xl xxs:rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/30 hover:from-white hover:to-amber-50 border border-slate-200/90 hover:border-amber-400 shadow-2xs hover:shadow-xs flex items-center justify-between transition-all duration-200 group text-left active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`p-2 rounded-lg xxs:rounded-xl ${item.color} shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
                      <IconComponent className="!w-4 !h-4 xxs:!w-5 xxs:!h-5" />
                    </div>
                    <div className="min-w-0 truncate">
                      <div className="text-[11px] xxs:text-xs font-extrabold text-slate-900 truncate group-hover:text-amber-700 transition-colors">
                        {item.name}
                      </div>
                      <span className="text-[9px] xxs:text-[10px] text-slate-500 truncate block font-medium">{item.subtitle}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 text-[8px] xxs:text-[9px] font-black uppercase tracking-wider rounded-md xxs:rounded-lg border transition-all duration-200 ${item.actionColor} shrink-0 ml-1 flex items-center gap-0.5`}>
                    {item.actionText}
                    <ChevronRightIcon className="!w-3 !h-3 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </a>
              );
            })}
          </div>

          {/* Footer Card Bar Hint */}
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] xxs:text-[11px] text-slate-500 shrink-0">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-emerald-700 font-bold">Agents Available Online</span>
            </span>
            <span className="text-slate-400 font-medium">Tap anywhere to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}

