const fs = require('fs');

let sidebar = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

// Add useTranslation
sidebar = sidebar.replace("import { useStore } from '@/store/useStore';", "import { useStore } from '@/store/useStore';\nimport { useTranslation } from '@/hooks/useTranslation';");
sidebar = sidebar.replace("const pathname = usePathname();", "const pathname = usePathname();\n  const { t } = useTranslation();");

// Replace strings
sidebar = sidebar.replace("'الرئيسية'", "t('sidebar.dashboard')");
sidebar = sidebar.replace("'العمليات'", "t('sidebar.operations')");
sidebar = sidebar.replace("'عروض الأسعار'", "t('sidebar.quotations')");
sidebar = sidebar.replace("'الفواتير'", "t('sidebar.invoices')");
sidebar = sidebar.replace("'المكتبة'", "t('sidebar.library')");
sidebar = sidebar.replace("'العملاء'", "t('sidebar.customers')");
sidebar = sidebar.replace("'المنتجات'", "t('sidebar.products')");
sidebar = sidebar.replace("'الملاحظات الجاهزة'", "t('sidebar.notes')");
sidebar = sidebar.replace("'الإدارة'", "t('sidebar.management')");
sidebar = sidebar.replace("'الشركات'", "t('sidebar.entities')");
sidebar = sidebar.replace("'التقارير'", "t('sidebar.reports')");
sidebar = sidebar.replace("'الإعدادات'", "t('sidebar.settings')");
sidebar = sidebar.replace("<span>طيّ القائمة</span>", "<span>{t('sidebar.collapse')}</span>");

fs.writeFileSync('src/components/layout/Sidebar.tsx', sidebar, 'utf8');

let topbar = fs.readFileSync('src/components/layout/TopBar.tsx', 'utf8');

topbar = topbar.replace("import { useStore } from '@/store/useStore';", "import { useStore } from '@/store/useStore';\nimport { useTranslation } from '@/hooks/useTranslation';\nimport { Languages } from 'lucide-react';");

topbar = topbar.replace("  const router = useRouter();", "  const router = useRouter();\n  const { t } = useTranslation();\n  const { language, setLanguage } = useStore();");

topbar = topbar.replace("<span>لوحة التحكم</span>", "<span>{t('topbar.dashboard')}</span>");
topbar = topbar.replace("<span className=\"text-foreground font-medium\">لوحة التحكم</span>", "<span className=\"text-foreground font-medium\">{t('topbar.dashboard')}</span>");
topbar = topbar.replace("<span>بحث أو أمر سريع...</span>", "<span>{t('topbar.searchcmd')}</span>");

// Add Language Switcher Button before Theme Switcher
const langButton = `
          <button 
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 h-8 px-2.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors text-[12px] font-medium"
          >
            <Languages className="w-4 h-4" />
            <span>{language === 'ar' ? 'EN' : 'AR'}</span>
          </button>
`;
topbar = topbar.replace("<div className=\"w-px h-5 bg-border mx-1.5\"></div>", "<div className=\"w-px h-5 bg-border mx-1.5\"></div>\n" + langButton);

// We'll manually replace the other nested strings since they are inside child components:
topbar = topbar.replace("function NotificationsDropdown() {", "function NotificationsDropdown() {\n  const { t } = useTranslation();");
topbar = topbar.replace("function UserMenu({ onLogout }: any) {", "function UserMenu({ onLogout }: any) {\n  const { t } = useTranslation();");

topbar = topbar.replace("الإشعارات</div>", "{t('topbar.notifications')}</div>");
topbar = topbar.replace("تحديد الكل كمقروء</button>", "{t('topbar.mark_all_read')}</button>");
topbar = topbar.replace("عرض كل الإشعارات</button>", "{t('topbar.view_all_notif')}</button>");

topbar = topbar.replace("label=\"الملف الشخصي\"", "label={t('topbar.profile')}");
topbar = topbar.replace("label=\"الإعدادات\"", "label={t('topbar.settings')}");
topbar = topbar.replace("label=\"الفوترة والاشتراك\"", "label={t('topbar.billing')}");
topbar = topbar.replace("label=\"اختصارات لوحة المفاتيح\"", "label={t('topbar.shortcuts')}");
topbar = topbar.replace("label=\"الدعم والمساعدة\"", "label={t('topbar.support')}");
topbar = topbar.replace("label=\"ما الجديد\"", "label={t('topbar.whats_new')}");
topbar = topbar.replace("<span>تسجيل الخروج</span>", "<span>{t('topbar.logout')}</span>");

fs.writeFileSync('src/components/layout/TopBar.tsx', topbar, 'utf8');

console.log("Translation applied!");
