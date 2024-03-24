import React, { useContext } from "react";
import { TranslatorContext } from "../../context/Translator";
import { ButtonComponent, AnchorComponent } from "../../components/elements";
import IconFieldComponent from "../../components/fields/IconFieldComponent";
import LogoComponent from "../../components/LogoComponent";

export default function RegisterPage() {

    const { t } = useContext(TranslatorContext);
    
    return (
        <div className="mc-register">
            <div className="mc-register-banner">
                <img 
                    className="mc-register-banner-pattern" 
                    src="images/pattern.webp"
                    alt="pattern"
                />
                <div className="mc-register-banner-content">
                    <h2 className="mc-register-banner-title">Best ux/ui fashion ecommerce dashboard & admin panel</h2>
                    <p className="mc-register-banner-descrip">Elit Iusto dolore libero recusandae dolor dolores explicabo ullam cum facilis aperiam   alias odio quam excepturi molestiae omnis inventore. Repudiandae officia placeat amet consectetur dicta dolorem quo</p>
                    <AnchorComponent 
                        to="/ecommerce"
                        icon="home" 
                        text={t('go_to_home')} 
                        className="mc-btn primary" 
                    />
                </div>
            </div>
            <form className="mc-register-form">
                <LogoComponent 
                    src="images/logo.webp"
                    alt="logo" 
                    href="/ecommerce"
                    className="mc-auth-logo"
                />
                <h4 className="mc-auth-title">Register a new account</h4>
                <IconFieldComponent 
                    icon="account_circle"
                    type="text"
                    classes="h-sm"
                    placeholder={t('enter_your_name')}
                />
                <IconFieldComponent 
                    icon="email"
                    type="email"
                    classes="h-sm"
                    placeholder={t('enter_your_email')}
                />
                <IconFieldComponent 
                    icon="lock"
                    type="password"
                    classes="h-sm"
                    placeholder={t('enter_your_password')}
                    passwordVisible={true}
                />
                <IconFieldComponent 
                    icon="verified_user"
                    type="password"
                    classes="h-sm"
                    placeholder={t('confirm_your_password')}
                    passwordVisible={true}
                />
                <div className="mc-auth-checkbox">
                    <input type="checkbox" id="checkbox" />
                    <label htmlFor="checkbox">I agree to the all Terms & Condiotions</label>
                </div>
                <ButtonComponent className="mc-auth-btn h-sm" type="button">{t('sign_up')}</ButtonComponent>
                <div className="mc-auth-divide"><span>{t('or')}</span></div>
                <div className="mc-auth-connect">
                    <AnchorComponent to="#" className="twitter h-sm">
                        <i className="icofont-twitter"></i>
                        <span>Continue with Twitter</span>
                    </AnchorComponent>
                    <AnchorComponent to="#" className="facebook h-sm">
                        <i className="icofont-facebook"></i>
                        <span>Continue with Facebook</span>
                    </AnchorComponent>
                </div>
                <div className="mc-register-navigate">
                    <span>Already have an account?</span>
                    <AnchorComponent to="/login">{t('login')}</AnchorComponent>
                </div>
            </form>
        </div>
    )
}