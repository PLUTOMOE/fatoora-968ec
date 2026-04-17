"use client";

import { useActionState } from "react";
import { loginUser, registerUser } from "@/app/actions";

const initialMessage = null as string | null;

export function AuthPanel() {
  const [registerMessage, registerAction, registerPending] = useActionState(
    registerUser,
    initialMessage,
  );
  const [loginMessage, loginAction, loginPending] = useActionState(
    loginUser,
    initialMessage,
  );

  return (
    <div className="auth-shell">
      <div className="auth-center">
        <div className="auth-branding">
          <div className="auth-brand-icon">ف</div>
          <h1>فاتوره</h1>
          <p>نظام عربي لإدارة عروض الأسعار والفواتير الضريبية.</p>
        </div>

        <section className="login-card-v2">
          <div className="login-card-accent" />
          <h2>تسجيل الدخول</h2>

          <form action={loginAction} className="auth-form-v2">
            <label>
              <span>البريد الإلكتروني</span>
              <div className="input-wrap">
                <span className="material-symbols-outlined auth-input-icon">mail</span>
                <input
                  dir="ltr"
                  name="email"
                  type="email"
                  placeholder="name@company.com"
                />
              </div>
            </label>

            <label>
              <div className="auth-label-row">
                <span>كلمة المرور</span>
                <button type="button" className="auth-inline-link">
                  هل نسيت كلمة المرور؟
                </button>
              </div>
              <div className="input-wrap">
                <span className="material-symbols-outlined auth-input-icon">
                  visibility
                </span>
                <input
                  dir="ltr"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                />
              </div>
            </label>

            {loginMessage ? <p className="form-message">{loginMessage}</p> : null}

            <button type="submit" className="auth-submit-v2" disabled={loginPending}>
              <span>{loginPending ? "جاري التحقق..." : "الدخول إلى النظام"}</span>
              <span className="material-symbols-outlined auth-submit-icon">
                arrow_back
              </span>
            </button>
          </form>
        </section>

        <section className="register-strip">
          <div className="register-strip-head">
            <h3>ليس لديك حساب؟</h3>
            <p>أرسل طلب تفعيل جديد وسيظهر داخل لوحة الإدارة للموافقة.</p>
          </div>

          <form action={registerAction} className="register-inline-form">
            <input name="full_name" placeholder="الاسم" />
            <input name="email" type="email" placeholder="البريد الإلكتروني" />
            <input name="password" type="password" placeholder="كلمة المرور" />
            <button
              type="submit"
              className="primary-button ghost-green"
              disabled={registerPending}
            >
              {registerPending ? "جاري الإرسال..." : "إنشاء حساب جديد"}
            </button>
          </form>

          {registerMessage ? <p className="form-message">{registerMessage}</p> : null}
        </section>

        <div className="auth-demo-note">
          <strong>حساب الإدارة التجريبي</strong>
          <span>owner@fatora.app</span>
          <span>admin123</span>
        </div>
      </div>
    </div>
  );
}
