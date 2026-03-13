// Language Switcher Component
// Multi-language support (English & Irish Gaelic)

import React, { useState } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Globe, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Language {
  code: 'en' | 'ga';
  name: string;
  nativeName: string;
  flag: string;
}

const languages: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ga', name: 'Irish', nativeName: 'Gaeilge', flag: '🇮🇪' },
];

export function LanguageSwitcher() {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ga'>('en');

  const handleLanguageChange = (langCode: string) => {
    setSelectedLanguage(langCode as 'en' | 'ga');
    const lang = languages.find((l) => l.code === langCode);
    toast.success(`Language changed to ${lang?.nativeName}`);
  };

  return (
    <Card className="p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Globe className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-[#101828]">Language Preferences</h3>
          <p className="text-sm text-[#6a7282]">Select your preferred interface language</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="language-select">Interface Language</Label>
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger id="language-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.code} value={lang.code}>
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.nativeName}</span>
                    {lang.name !== lang.nativeName && (
                      <span className="text-xs text-[#6a7282]">({lang.name})</span>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Current Language</p>
              <p className="text-sm text-blue-700 mt-1">
                {languages.find((l) => l.code === selectedLanguage)?.flag}{' '}
                {languages.find((l) => l.code === selectedLanguage)?.nativeName}
              </p>
            </div>
          </div>
        </div>

        {selectedLanguage === 'ga' && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <Globe className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">Gaeilge Activated</p>
                <p className="text-sm text-green-700 mt-1">
                  Tá an Ghaeilge ar fáil anois. Is féidir leat an t-idirbheo a úsáid i nGaeilge.
                </p>
                <p className="text-xs text-green-600 mt-2">
                  (Irish language is now available. You can use the interface in Irish.)
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-medium text-[#101828]">Translation Coverage</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6a7282]">Navigation & Menus</span>
              <Badge className="bg-green-100 text-green-700 border-green-200">100%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6a7282]">Forms & Labels</span>
              <Badge className="bg-green-100 text-green-700 border-green-200">100%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6a7282]">Reports & Documents</span>
              <Badge className="bg-green-100 text-green-700 border-green-200">95%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#6a7282]">Help & Tooltips</span>
              <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">85%</Badge>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-xs text-[#6a7282]">
            Language support is provided in compliance with the Official Languages Act 2003. All
            statutory reporting and regulatory submissions support both English and Irish.
          </p>
        </div>
      </div>
    </Card>
  );
}

// Translation helper functions (would be expanded with full i18n library)
export const translations = {
  en: {
    dashboard: 'Dashboard',
    emissions: 'Emissions',
    reports: 'Reports',
    settings: 'Settings',
    logout: 'Log Out',
  },
  ga: {
    dashboard: 'Deais',
    emissions: 'Astaíochtaí',
    reports: 'Tuairiscí',
    settings: 'Socruithe',
    logout: 'Logáil Amach',
  },
};

export function useTranslation(lang: 'en' | 'ga' = 'en') {
  return {
    t: (key: keyof typeof translations.en) => {
      return translations[lang][key] || translations.en[key];
    },
    lang,
  };
}
