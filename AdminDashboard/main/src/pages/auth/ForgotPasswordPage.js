import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { ButtonComponent, AnchorComponent } from "../../components/elements";
import IconFieldComponent from "../../components/fields/IconFieldComponent";
import LogoComponent from "../../components/LogoComponent";

export default function ForgotPasswordPage() {

    const { t } = useContext(TranslatorContext);

    return (
        <div className="mc-auth">
            <img 
                className="mc-auth-pattern" 
                src="images/pattern.webp"
                alt="pattern"
            />
            <div className="mc-auth-group">
                <LogoComponent 
                    src="images/logo.webp"
                    alt="logo" 
                    href="/ecommerce"
                    className="mc-auth-logo"
                />
                <h4 className="mc-auth-title">{t('reset_the_password')}</h4>
                <form className="mc-auth-form">
                    <IconFieldComponent 
                        icon="email"
                        type="email"
                        classes="h-sm"
                        placeholder="Enter your email"
                    />
                    <ButtonComponent className="mc-auth-btn h-sm" type="button">
                        {t('get_link')}
                    </ButtonComponent>
                </form>
                <div className="mc-auth-navigate">
                    <span>{t('remember_the_password')}?</span>
                    <AnchorComponent to="/login">{t('login')}</AnchorComponent>
                </div>
            </div>
        </div>
    );
}