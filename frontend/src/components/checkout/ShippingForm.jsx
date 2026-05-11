import { Mail, Phone, MapPin, Truck, Clock, Info } from 'lucide-react';

const ShippingForm = ({ formData, onChange, errors = {} }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <div className="shipping-form-wrap">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        .shipping-form-wrap {
          font-family: 'DM Sans', sans-serif;
        }
        .shipping-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.4rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .shipping-section-title svg {
          color: var(--gold);
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-group label {
          display: block;
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 8px;
          color: #fff;
        }
        .input-icon-wrapper {
          position: relative;
        }
        .input-icon-wrapper .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gold);
          width: 18px;
          height: 18px;
          pointer-events: none;
        }
        .input-icon-wrapper textarea ~ .input-icon {
          top: 16px;
          transform: none;
        }
        .form-input, .form-select, .form-textarea {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 12px 16px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--gold);
          background: rgba(240,165,0,0.05);
        }
        .form-input.error, .form-select.error, .form-textarea.error {
          border-color: #f87171;
        }
        .input-icon-wrapper .form-input, .input-icon-wrapper .form-textarea {
          padding-left: 40px;
        }
        .error-message {
          margin-top: 6px;
          font-size: 0.7rem;
          color: #f87171;
        }
        .row-2cols {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .row-3cols {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .delivery-info {
          background: var(--navy-2);
          border: 1px solid rgba(240,165,0,0.2);
          border-radius: 16px;
          padding: 16px;
          margin-top: 24px;
        }
        .delivery-info h4 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--gold);
          margin-bottom: 12px;
        }
        .delivery-info ul {
          margin: 0;
          padding-left: 20px;
        }
        .delivery-info li {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.7);
          margin-bottom: 6px;
        }
        @media (max-width: 640px) {
          .row-2cols, .row-3cols { grid-template-columns: 1fr; gap: 12px; }
        }
      `}</style>

      <div>
        <div className="shipping-section-title">
          <Truck size={22} /> Shipping Information
        </div>

        {/* Full Name */}
        <div className="form-group">
          <label>Full Name <span style={{ color: 'var(--gold)' }}>*</span></label>
          <input
            type="text"
            name="shipping_name"
            value={formData.shipping_name}
            onChange={handleInputChange}
            required
            className={`form-input ${errors.shipping_name ? 'error' : ''}`}
            placeholder="John Doe"
          />
          {errors.shipping_name && <div className="error-message">{errors.shipping_name}</div>}
        </div>

        {/* Email and Phone (2 cols) */}
        <div className="row-2cols">
          <div className="form-group">
            <label>Email Address <span style={{ color: 'var(--gold)' }}>*</span></label>
            <div className="input-icon-wrapper">
              <Mail className="input-icon" />
              <input
                type="email"
                name="shipping_email"
                value={formData.shipping_email}
                onChange={handleInputChange}
                required
                className={`form-input ${errors.shipping_email ? 'error' : ''}`}
                placeholder="john@example.com"
              />
            </div>
            {errors.shipping_email && <div className="error-message">{errors.shipping_email}</div>}
          </div>

          <div className="form-group">
            <label>Phone Number <span style={{ color: 'var(--gold)' }}>*</span></label>
            <div className="input-icon-wrapper">
              <Phone className="input-icon" />
              <input
                type="tel"
                name="shipping_phone"
                value={formData.shipping_phone}
                onChange={handleInputChange}
                required
                className={`form-input ${errors.shipping_phone ? 'error' : ''}`}
                placeholder="+92 300 1234567"
              />
            </div>
            {errors.shipping_phone && <div className="error-message">{errors.shipping_phone}</div>}
          </div>
        </div>

        {/* Address */}
        <div className="form-group">
          <label>Street Address <span style={{ color: 'var(--gold)' }}>*</span></label>
          <div className="input-icon-wrapper">
            <MapPin className="input-icon" />
            <textarea
              name="shipping_address"
              value={formData.shipping_address}
              onChange={handleInputChange}
              required
              rows="3"
              className={`form-textarea ${errors.shipping_address ? 'error' : ''}`}
              placeholder="House/Flat No., Street Name, Area"
            />
          </div>
          {errors.shipping_address && <div className="error-message">{errors.shipping_address}</div>}
        </div>

        {/* City, State, ZIP (3 cols) */}
        <div className="row-3cols">
          <div className="form-group">
            <label>City <span style={{ color: 'var(--gold)' }}>*</span></label>
            <input
              type="text"
              name="shipping_city"
              value={formData.shipping_city}
              onChange={handleInputChange}
              required
              className={`form-input ${errors.shipping_city ? 'error' : ''}`}
              placeholder="Islamabad"
            />
            {errors.shipping_city && <div className="error-message">{errors.shipping_city}</div>}
          </div>

          <div className="form-group">
            <label>Province/State <span style={{ color: 'var(--gold)' }}>*</span></label>
            <select
              name="shipping_state"
              value={formData.shipping_state}
              onChange={handleInputChange}
              required
              className={`form-select ${errors.shipping_state ? 'error' : ''}`}
            >
              <option value="">Select Province</option>
              <option value="Punjab">Punjab</option>
              <option value="Sindh">Sindh</option>
              <option value="KPK">Khyber Pakhtunkhwa</option>
              <option value="Balochistan">Balochistan</option>
              <option value="Gilgit-Baltistan">Gilgit-Baltistan</option>
              <option value="AJK">Azad Jammu & Kashmir</option>
              <option value="Islamabad">Islamabad Capital Territory</option>
            </select>
            {errors.shipping_state && <div className="error-message">{errors.shipping_state}</div>}
          </div>

          <div className="form-group">
            <label>Postal Code <span style={{ color: 'var(--gold)' }}>*</span></label>
            <input
              type="text"
              name="shipping_zip"
              value={formData.shipping_zip}
              onChange={handleInputChange}
              required
              className={`form-input ${errors.shipping_zip ? 'error' : ''}`}
              placeholder="44000"
            />
            {errors.shipping_zip && <div className="error-message">{errors.shipping_zip}</div>}
          </div>
        </div>

        {/* Order Notes */}
        <div className="form-group">
          <label>Order Notes (Optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows="3"
            className="form-textarea"
            placeholder="Any special instructions for delivery? (e.g., gate code, preferred delivery time)"
          />
        </div>

        {/* Delivery Information Box */}
        <div className="delivery-info">
          <h4><Info size={16} /> Delivery Information</h4>
          <ul>
            <li>• Standard delivery takes 3-5 business days</li>
            <li>• Please ensure someone is available to receive the package</li>
            <li>• Contact number will be used for delivery updates</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ShippingForm;