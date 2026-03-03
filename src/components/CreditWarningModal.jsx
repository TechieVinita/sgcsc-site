import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

/**
 * CreditWarningModal Component
 * Modal that appears when trying to perform action with insufficient credits
 * Shows required credits vs available credits
 * Provides link to credits top-up page
 * 
 * Usage:
 * const { checkCredits, CreditWarningModal } = useCreditCheck();
 * 
 * // In JSX:
 * <CreditWarningModal />
 * 
 * // Before action:
 * const hasCredits = await checkCredits(requiredCredits);
 * if (!hasCredits) return; // Modal will show automatically
 */
export function useCreditCheck() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [creditInfo, setCreditInfo] = useState({
    required: 0,
    available: 0,
    feature: "",
  });
  const [checking, setChecking] = useState(false);

  /**
   * Check if franchise has sufficient credits
   * @param {number} requiredCredits - Number of credits required
   * @param {string} featureName - Name of the feature/action
   * @returns {Promise<boolean>} - True if has sufficient credits
   */
  const checkCredits = async (requiredCredits, featureName = "this action") => {
    const franchiseToken = localStorage.getItem("franchise_token");
    const userRole = localStorage.getItem("user_role");

    // Only check for franchise users
    if (userRole !== "franchise" || !franchiseToken) {
      return true;
    }

    setChecking(true);
    try {
      const res = await API.get("/credits/my-credits");
      const availableCredits = res.data?.data?.credits ?? 0;

      if (availableCredits < requiredCredits) {
        setCreditInfo({
          required: requiredCredits,
          available: availableCredits,
          feature: featureName,
        });
        setShowModal(true);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Failed to check credits:", err);
      // Fail open - allow action if credit check fails
      return true;
    } finally {
      setChecking(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const goToTopUp = () => {
    closeModal();
    navigate("/franchise/credits");
  };

  const CreditWarningModalComponent = () => {
    if (!showModal) return null;

    const deficit = creditInfo.required - creditInfo.available;

    return (
      <div
        className="modal show d-block"
        tabIndex="-1"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            {/* Header */}
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Insufficient Credits
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                onClick={closeModal}
                aria-label="Close"
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body p-4">
              <div className="text-center mb-4">
                <div
                  className="rounded-circle bg-danger bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                  style={{ width: 64, height: 64 }}
                >
                  <i
                    className="bi bi-coin text-danger"
                    style={{ fontSize: "2rem" }}
                  ></i>
                </div>
                <h5 className="mb-2">Not Enough Credits</h5>
                <p className="text-muted mb-0">
                  You need more credits to {creditInfo.feature.toLowerCase()}.
                </p>
              </div>

              {/* Credit Summary */}
              <div className="bg-light rounded-3 p-3 mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Required:</span>
                  <span className="fw-bold text-danger">
                    {creditInfo.required} credits
                  </span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted">Available:</span>
                  <span className="fw-bold text-success">
                    {creditInfo.available} credits
                  </span>
                </div>
                <hr className="my-2" />
                <div className="d-flex justify-content-between align-items-center">
                  <span className="text-muted">Deficit:</span>
                  <span className="fw-bold text-danger">{deficit} credits</span>
                </div>
              </div>

              <p className="text-muted small text-center mb-0">
                Top up your credits to continue using all features.
              </p>
            </div>

            {/* Footer */}
            <div className="modal-footer border-0 pt-0">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={goToTopUp}
              >
                <i className="bi bi-credit-card me-2"></i>
                Top Up Credits
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return {
    checkCredits,
    checking,
    CreditWarningModal: CreditWarningModalComponent,
  };
}

/**
 * Standalone CreditWarningModal component
 * For use when you want to control the modal visibility externally
 */
export default function CreditWarningModal({
  show,
  onClose,
  requiredCredits,
  availableCredits,
  featureName = "this action",
}) {
  const navigate = useNavigate();

  if (!show) return null;

  const deficit = requiredCredits - availableCredits;

  const goToTopUp = () => {
    onClose();
    navigate("/franchise/credits");
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          {/* Header */}
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Insufficient Credits
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            <div className="text-center mb-4">
              <div
                className="rounded-circle bg-danger bg-opacity-10 d-inline-flex align-items-center justify-content-center mb-3"
                style={{ width: 64, height: 64 }}
              >
                <i
                  className="bi bi-coin text-danger"
                  style={{ fontSize: "2rem" }}
                ></i>
              </div>
              <h5 className="mb-2">Not Enough Credits</h5>
              <p className="text-muted mb-0">
                You need more credits to {featureName.toLowerCase()}.
              </p>
            </div>

            {/* Credit Summary */}
            <div className="bg-light rounded-3 p-3 mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Required:</span>
                <span className="fw-bold text-danger">
                  {requiredCredits} credits
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Available:</span>
                <span className="fw-bold text-success">
                  {availableCredits} credits
                </span>
              </div>
              <hr className="my-2" />
              <div className="d-flex justify-content-between align-items-center">
                <span className="text-muted">Deficit:</span>
                <span className="fw-bold text-danger">{deficit} credits</span>
              </div>
            </div>

            <p className="text-muted small text-center mb-0">
              Top up your credits to continue using all features.
            </p>
          </div>

          {/* Footer */}
          <div className="modal-footer border-0 pt-0">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={goToTopUp}
            >
              <i className="bi bi-credit-card me-2"></i>
              Top Up Credits
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
