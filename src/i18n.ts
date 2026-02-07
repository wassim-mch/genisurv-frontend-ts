import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      dashboard: "Dashboard",
      users: "Users",
      roles: "Roles",
      wilayas: "Wilayas",
      alimentation: "Alimentation",
      permissions: "Permissions",
      decaissements: "Decaissements",
      encaissements: "Encaissements",
      encaissement: "Encaissement",
      decaissement: "Decaissement",
      caisses: "Caisses",
      operations: "Operations",
      date_creation: "Creation Date",

      caisse: "Caisse",
      montant: "Amount",

      create: "Create",
      update: "Update",
      cancel: "Cancel",
      edit: "Edit",

      logout: "Logout",
      welcome: "Welcome",
      name: "Name",
      email: "Email",
      role: "Role",

      actions: "Actions",
      par: "By",
      loading: "Loading...",
    
      permission_denied: "Permission Denied",

      validation_required: "This field is required",
      validation_email: "Invalid email address",
      validation_min_0: "Amount must be greater than 0",
    
      delete: "Delete",
      confirm_delete: "Are you sure?",
      password: "Password",
      confirm_password: "Confirm password",
      select_role: "Select role",
      select_wilaya: "Select wilaya",
      wilaya: "Wilaya",
      validation_min_8: "Password must be at least 8 characters",
      validation_password_mismatch: "Passwords do not match",
      balance: "Balance",
      total_alimentation: "Total Alimentation",
      total_decaissement: "Total Decaissement",
      total_encaissement: "Total Encaissement",
      verify_email_msg: "Verify your email to activate your account.",
      send_verification: "Send verification email",
      sending: "Sending..."

    },
  },

  fr: {
    translation: {
      dashboard: "Tableau de bord",
      users: "Utilisateurs",
      roles: "Rôles",
      wilayas: "Wilayas",
      alimentation: "Alimentation",
      permissions: "Permissions",
      decaissements: "Décaissements",
      encaissements: "Encaissements",
      encaissement: "Encaissement",
      decaissement: "Décaissement",
      caisses: "Caisses",
      operations: "Opérations",
      date_creation: "Date de création",

      caisse: "Caisse",
      montant: "Montant",

      create: "Créer",
      update: "Modifier",
      cancel: "Annuler",
      edit: "Modifier",

      logout: "Déconnexion",
      welcome: "Bienvenue",
      name: "Nom",
      email: "Email",
      role: "Rôle",

      actions: "Actions",
      par: "Par",
      loading: "Chargement...",

      permission_denied: "Permission refusée",

      validation_required: "Ce champ est requis",
      validation_email: "Email invalide",
      validation_min_0: "Le montant doit être supérieur à 0",

      delete: "Supprimer",
      confirm_delete: "Êtes-vous sûr ?",
      password: "Mot de passe",
      confirm_password: "Confirmer mot de passe",
      select_role: "Choisir rôle",
      select_wilaya: "Choisir wilaya",
      wilaya: "Wilaya",
      validation_min_8: "Le mot de passe doit contenir au moins 8 caractères",
      validation_password_mismatch: "Les mots de passe ne correspondent pas",
      balance: "Solde",
      total_alimentation: "Total Alimentation",
      total_decaissement: "Total Décaissement",
      total_encaissement: "Total Encaissement",
      verify_email_msg: "Vérifiez votre email pour activer votre compte.",
      send_verification: "Envoyer email de vérification",
      sending: "Envoi..."
    },
  },

  ar: {
    translation: {
      dashboard: "لوحة التحكم",
      users: "المستخدمون",
      roles: "الأدوار",
      wilayas: "الولايات",
      alimentation: "التغذية",
      permissions: "الأذونات",
      decaissements: "المدفوعات",
      encaissements: "المقبوضات",
      encaissement: "مقبوض",
      decaissement: "مدفوع",
      caisses: "الصناديق",
      operations: "العمليات",
      date_creation: "تاريخ الإنشاء",

      caisse: "الصندوق",
      montant: "المبلغ",

      create: "إضافة",
      update: "تعديل",
      cancel: "إلغاء",
      edit: "تعديل",

      logout: "تسجيل الخروج",
      welcome: "مرحبا",
      name: "الاسم",
      email: "البريد الإلكتروني",
      role: "الدور",

      actions: "الإجراءات",
      par: "بواسطة",
      loading: "جار التحميل...",


      permission_denied: "تم رفض الإذن",

      validation_required: "هذه الخانة مطلوبة",
      validation_email: "البريد الإلكتروني غير صالح",
      validation_min_0: "يجب أن يكون المبلغ أكبر من 0",

      delete: "حذف",
      confirm_delete: "هل أنت متأكد؟",
      password: "كلمة المرور",
      confirm_password: "تأكيد كلمة المرور",
      select_role: "اختر الدور",
      select_wilaya: "اختر الولاية",
      wilaya: "الولاية",
      validation_min_8: "يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل",
      validation_password_mismatch: "كلمتا المرور غير متطابقتين",
      balance: "الرصيد",
      total_alimentation: "إجمالي التغذية",
      total_decaissement: "إجمالي المدفوعات",
      total_encaissement: "إجمالي المقبوضات",
      verify_email_msg: "تحقق من بريدك الإلكتروني لتفعيل حسابك",
      send_verification: "إرسال بريد التفعيل",
      sending: "جار الإرسال..."
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
