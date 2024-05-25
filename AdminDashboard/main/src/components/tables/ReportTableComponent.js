import React, { useState, useEffect, useContext } from 'react';
import { TranslatorContext } from '../../context/Translator';
import { Modal, Form } from 'react-bootstrap';
import { ButtonComponent, AnchorComponent } from '../elements';
import axiosInstance from '../../configs/axiosInstance';

export default function ReportTableComponent({ thead, tbody, rowView, currentPage, setPages, reportType, _setReloadAction }) {
    const { t } = useContext(TranslatorContext);

    const [data, setData] = useState([]);
    const [userData, setUserData] = React.useState('');
    const [editModal, setEditModal] = React.useState(false);

    const [reloadAction, setReloadAction] = useState(false);

    const [selectedStatus, setSelectedStatus] = useState('');

    const [adminReportModal, setAdminReportModal] = useState(false);

    const changeReportStatusHandler = async (_id) => {
        if (selectedStatus) {
            try {
                const result = await axiosInstance.post(`/api/report/${_id}`);
                console.log(result.data.data);
                setReloadAction(!reloadAction);
                _setReloadAction(!reloadAction);
            } catch (e) {
                console.error(e);
            }
        }
        setEditModal(false);
        setSelectedStatus('');
    };

    useEffect(() => {
        const fetchAllReports = async () => {
            try {
                const result = await axiosInstance.get(
                    `/api/report?&currentPage=${currentPage}&limit=${rowView}&reportType=${reportType === 'all' ? '' : ''}`,
                );
                console.log(result.data);
                setData(result.data.reports);
                setPages(result.data.pages);
            } catch (e) {
                console.error(e);
            }
        };
        fetchAllReports();
    }, [reloadAction, rowView, currentPage, setPages, reportType]);

    return (
        <div className="mc-table-responsive">
            <table className="mc-table">
                <thead className="mc-table-head primary">
                    <tr>
                        <th>
                            <div className="mc-table-check">
                                <p>uid</p>
                            </div>
                        </th>
                        <th>sender</th>
                        <th>tagget</th>
                        <th>reason</th>
                        <th>status</th>
                        <th>created</th>
                        <th>action</th>
                    </tr>
                </thead>
                <tbody className="mc-table-body even">
                    {data?.map((item, index) => (
                        <tr key={index}>
                            <td title="id">
                                <div className="mc-table-check">
                                    <p>#{item._id}</p>
                                </div>
                            </td>
                            <td title={item.sender.name}>
                                <div className="mc-table-profile">
                                    {/* <img src={item.src} alt={item.alt} /> */}
                                    <p>{item.sender.name}</p>
                                </div>
                            </td>
                            <td title={item.target.type}>
                                <div className="mc-table-profile">
                                    {/* <img src={item.src} alt={item.alt} /> */}
                                    <p href={`/user/${item.target.type}`}>{item.target.type}</p>
                                </div>
                            </td>
                            <td title={item.reason}>{item.reason}</td>
                            <td title={item.markAtRead}>
                                {item.markAtRead === true && <p className="mc-table-badge green">Done</p>}
                                {item.markAtRead === false && <p className="mc-table-badge yellow">Pending</p>}
                            </td>
                            <td title={item.createDate}>{new Date(parseInt(item.createDate)).toLocaleString()}</td>
                            <td>
                                <div className="mc-table-action">
                                    {item.target.type !== 'Review' ? (
                                        <AnchorComponent
                                            to={`/product/${item.target.id}?reportId=${item._id}`}
                                            title="View"
                                            className="material-icons view"
                                        >
                                            visibility
                                        </AnchorComponent>
                                    ) : (
                                        <ButtonComponent
                                            title="View"
                                            className="material-icons view"
                                            onClick={() =>
                                                setAdminReportModal({
                                                    reviewId: item.target.id,
                                                    reason: item.reason,
                                                    id: item._id,
                                                })
                                            }
                                        >
                                            visibility
                                        </ButtonComponent>
                                    )}
                                    <ButtonComponent
                                        title="Edit"
                                        className="material-icons edit"
                                        onClick={() => setEditModal(true, setUserData(item))}
                                    >
                                        edit
                                    </ButtonComponent>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* report status */}
            <Modal show={editModal} onHide={() => setEditModal(false, setUserData(''))}>
                <div className="mc-user-modal">
                    <p className="mt-3">Set report status</p>
                    <Form.Group className="form-group inline">
                        <Form.Label>{t('status')}</Form.Label>
                        <Form.Select
                            onChange={(e) => {
                                console.log(e.target.value);
                                setSelectedStatus(e.target.value);
                            }}
                        >
                            <option value="done" selected={userData.markAtRead === true}>
                                {t('done')}
                            </option>
                            <option value="pending" selected={userData.markAtRead === false}>
                                {t('pending')}
                            </option>
                        </Form.Select>
                    </Form.Group>
                    <Modal.Footer>
                        <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setEditModal(false)}>
                            {t('close_popup')}
                        </ButtonComponent>
                        <ButtonComponent
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                                changeReportStatusHandler(userData._id);
                            }}
                        >
                            {t('save_changes')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
            {/* report detail */}
            <Modal show={adminReportModal} onHide={() => setAdminReportModal(false)}>
                <div className="mc-user-modal">
                    <p className="mt-4">Report review</p>
                    <p>Reason : {adminReportModal.reason}</p>
                    <ReportReviewComponent reviewId={adminReportModal.reviewId} reportId={adminReportModal.id} />
                    <Modal.Footer>
                        <ButtonComponent type="button" className="btn btn-secondary" onClick={() => setAdminReportModal(false)}>
                            {t('close_popup')}
                        </ButtonComponent>
                        <ButtonComponent
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                                setAdminReportModal(false);
                            }}
                        >
                            {t('save_changes')}
                        </ButtonComponent>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
}

const ReportReviewComponent = ({ reviewId, reportId }) => {
    const [reviewData, setReviewData] = useState();

    useEffect(() => {
        const fetchReviewData = async () => {
            if (reviewId) {
                try {
                    const response = await axiosInstance.get(`/api/review/${reviewId}`);
                    setReviewData(response.data.review);
                } catch (e) {
                    console.error(e);
                }
            }
        };
        fetchReviewData();
    }, [reviewId]);

    const hiddenReviewAction = async (action) => {
        console.log(action);
        try {
            const response = await axiosInstance.post(`/api/review/${reviewId}`, {
                isHidden: !!action,
            });
            if (reportId) {
                const result = await axiosInstance.post(`/api/report/${reportId}`);
            }
            console.log(response.data);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="d-flex flex-column">
            <div className="card p-2">
                <h5 className="mb-2">
                    User:{' '}
                    <a style={{ color: 'blue' }} href={`/user/${reviewData?.user}`}>
                        {reviewData?.name}
                    </a>
                </h5>
                <h5 className="mb-2">Comment: {reviewData?.comment}</h5>
                <div>
                    {reviewData?.images.map((item) => {
                        return <img style={{ borderRadius: '0px', margin: '0px' }} src={item.url} alt="img" />;
                    })}
                </div>
            </div>
            <div className="custome-checkbox mt-4">
                <input
                    className="form-check-input"
                    type="checkbox"
                    name="isHome"
                    id="HomeCheckbox"
                    onChange={(e) => {
                        hiddenReviewAction(e.target.checked);
                    }}
                    defaultChecked={reviewData?.hidden ? true : false}
                />
                <label style={{ userSelect: 'none' }} className="form-check-label ms-2" htmlFor="HomeCheckbox">
                    <span>Hidden</span>
                </label>
            </div>
        </div>
    );
};
