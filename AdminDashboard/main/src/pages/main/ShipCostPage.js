import React, { useEffect, useState } from 'react';
import PageLayout from '../../layouts/PageLayout';
import { Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { LabelFieldComponent } from '../../components/fields';
import { AnchorComponent } from '../../components/elements';
import axiosInstance from '../../configs/axiosInstance';
import { useDispatch } from 'react-redux';
import { setToastState, toastType } from '../../store/reducers/toastReducer';

export default function ShipCostPage() {
    const dispatch = useDispatch();

    const [inTownShipCost, setInTownShipCost] = useState();
    const [outTownShipCost, setOutTownShipCost] = useState();
    //
    const [reloadAction, setReloadAction] = useState(false);

    useEffect(() => {
        const fetchShipCost = async () => {
            try {
                const response = await axiosInstance.get('/api/shipCost');
                setInTownShipCost(response.data.inShipCost);
                setOutTownShipCost(response.data.outShipCost);
            } catch (err) {
                console.error(err);
            }
        };
        fetchShipCost();
    }, [reloadAction]);

    const saveShipCost = async () => {
        const validateData = () => {
            try {
                const a = parseFloat(inTownShipCost);
                const b = parseFloat(outTownShipCost);
                return true;
            } catch (err) {
                dispatch(setToastState({ Tstate: toastType.error, Tmessage: 'Invalid number' }));
                return false;
            }
        };
        try {
            if (!validateData()) {
                return;
            }
            const response = await axiosInstance.post('/api/shipCost', {
                inShipCost: inTownShipCost ? inTownShipCost : null,
                outShipCost: outTownShipCost ? outTownShipCost : null,
            });
            dispatch(setToastState({ Tstate: toastType.success, Tmessage: 'Ship cost saved' }));
            setReloadAction((st) => !st);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <PageLayout>
            <Row>
                <Col xl={12}>
                    <div className="mc-card">
                        <div className="mc-breadcrumb">
                            <h3 className="mc-breadcrumb-title">{'ecommerce'}</h3>
                            <ul className="mc-breadcrumb-list">
                                <li className="mc-breadcrumb-item">
                                    <Link to="#" className="mc-breadcrumb-link">
                                        {'home'}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">
                                    <Link to="#" className="mc-breadcrumb-link">
                                        {'dashboard'}
                                    </Link>
                                </li>
                                <li className="mc-breadcrumb-item">{'ecommerce'}</li>
                            </ul>
                        </div>
                    </div>
                </Col>
                <Col xl={12}>
                    <div className="mc-card">
                        <LabelFieldComponent
                            key={inTownShipCost}
                            type="text"
                            label={'Intra-city delivery cost'}
                            fieldSize="mb-4 w-100 h-md"
                            onChange={(e) => {
                                setInTownShipCost(parseFloat(e.target.value));
                            }}
                            defaultValue={inTownShipCost ? inTownShipCost : 0}
                            // err={titleErr}
                        />
                        <LabelFieldComponent
                            key={outTownShipCost}
                            type="text"
                            label={'Out-of-town delivery cost'}
                            fieldSize="mb-4 w-100 h-md"
                            onChange={(e) => {
                                setOutTownShipCost(parseFloat(e.target.value));
                            }}
                            defaultValue={outTownShipCost ? outTownShipCost : 0}
                            // err={titleErr}
                        />
                        <AnchorComponent
                            className="mc-btn w-100 primary mt-4"
                            text={'save'}
                            icon="save"
                            to="#"
                            onClick={saveShipCost}
                        />
                    </div>
                </Col>
            </Row>
        </PageLayout>
    );
}
