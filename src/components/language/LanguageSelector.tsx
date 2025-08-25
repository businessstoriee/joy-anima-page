import { useLanguageTranslation } from '@/components/language/useLanguageTranslation';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

export default function LanguageSelector() {
  const { currentLanguage, changeLanguage, languages } = useLanguageTranslation();

  return (
    <Select
      value={currentLanguage.code}
      onValueChange={changeLanguage}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map(lang => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}