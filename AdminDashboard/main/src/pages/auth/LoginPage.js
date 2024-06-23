import React, { createRef, useContext } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { ButtonComponent } from '../../components/elements';
import IconFieldComponent from '../../components/fields/IconFieldComponent';
import LogoComponent from '../../components/LogoComponent';
import { useDispatch } from 'react-redux';
import { setAdminToken, setRole, setShopId, setStatus, setUserId } from '../../store/reducers/authReducer';
import { Toast } from 'react-bootstrap';
import axiosInstance from '../../configs/axiosInstance';
import { setToastState, toastType } from '../../store/reducers/toastReducer';

export default function LoginPage() {
    const { t } = useContext(TranslatorContext);

    const dispatch = useDispatch();

    // const email= useRef();
    // const pass = useRef();

    const email = createRef();
    const pass = createRef();

    const loginHandler = async (e) => {
        e.preventDefault();
        try {
            const result = await axiosInstance.post('/api/auth/login', {
                email: email.current.value,
                password: pass.current.value,
                isAdminPage: true,
            });
            console.log(result.data);
            dispatch(setAdminToken(result.data.token));
            dispatch(setRole(result.data.data.role));
            dispatch(setShopId(result.data.data.shop));
            dispatch(setUserId(result.data.data.userId));
            dispatch(setStatus(result.data.data.status));
        } catch (e) {
            console.log(e);
            dispatch(setToastState({ Tstate: toastType.error, Tmessage: e.response.data.data.message }));
        }
    };

    return (
        <div className="mc-auth">
            <img src="images/pattern.webp" alt="pattern" className="mc-auth-pattern" />
            <div className="mc-auth-group">
                <LogoComponent src="images/4.png" alt="logo" href="/ecommerce" className="mc-auth-logo" />
                <h4 className="mc-auth-title">Login to HostPage</h4>
                <form className="mc-auth-form" onSubmit={(e) => loginHandler(e)}>
                    <IconFieldComponent
                        icon="email"
                        type="email"
                        classes="w-100 h-sm"
                        placeholder={t('enter_your_email')}
                        ref={email}
                    />
                    <IconFieldComponent
                        icon="lock"
                        type="password"
                        classes="w-100 h-sm"
                        placeholder={t('enter_your_password')}
                        passwordVisible={true}
                        ref={pass}
                    />
                    {/* <IconFieldComponent 
                        icon="verified_user"
                        classes="w-100 h-sm"
                        option={["select user role", "admin", "member", "client", "manager", "vendor"]}
                    /> */}
                    <ButtonComponent className="mc-auth-btn h-sm" type="submit">
                        {t('sign_in')}
                    </ButtonComponent>
                    {/* <AnchorComponent className="mc-auth-forgot" to="/forgot-password">{t('forgot_password')}</AnchorComponent> */}
                    {/* <div className="mc-auth-divide"><span>{t('or')}</span></div>
                    <div className="mc-auth-connect">
                        <AnchorComponent to="#" className="twitter h-sm">
                            <i className="icofont-twitter"></i>
                            <span>Continue with Twitter</span>
                        </AnchorComponent>
                        <AnchorComponent to="#" className="facebook h-sm">
                            <i className="icofont-facebook"></i>
                            <span>Continue with Facebook</span>P
                        </AnchorComponent>
                    </div> */}
                </form>
                {/* <div className="mc-auth-navigate">
                    <span>Don't have an account?</span>
                    <AnchorComponent to="/register">{t('register')}</AnchorComponent>
                </div> */}
            </div>
        </div>
    );
}
