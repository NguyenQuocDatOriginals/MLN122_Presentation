import React, { useState } from 'react';
import './App.scss';

interface FormData {
  revenue: string;
  laborCost: string;
  materialCost: string;
  depreciation: string;
  otherCosts: string;
  reinvestmentRate: string; // Tỷ lệ tái đầu tư (%)
  returnRate: string; // Tỷ lệ sinh lời (%)
}

const App: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    revenue: '',
    laborCost: '',
    materialCost: '',
    depreciation: '',
    otherCosts: '',
    reinvestmentRate: '',
    returnRate: '',
  });
  const [profit, setProfit] = useState<number | null>(null);
  const [surplusValue, setSurplusValue] = useState<number | null>(null);
  const [futureProfit, setFutureProfit] = useState<number | null>(null);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  // Hàm định dạng số với dấu chấm ngăn cách hàng nghìn
  const formatNumber = (value: string): string => {
    const number = parseInt(value.replace(/\D/g, ''), 10);
    if (isNaN(number)) return '';
    return number.toLocaleString('vi-VN');
  };

  // Hàm kiểm tra bội số của 1000
  const isMultipleOf1000 = (value: string): boolean => {
    const number = parseInt(value.replace(/\D/g, ''), 10);
    return number % 1000 === 0;
  };

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const rawValue = value.replace(/\D/g, ''); // Loại bỏ ký tự không phải số
    setFormData((prev) => ({ ...prev, [name]: rawValue }));

    // Kiểm tra bội số của 1000 cho các trường chi phí và doanh thu
    if (['revenue', 'laborCost', 'materialCost', 'depreciation', 'otherCosts'].includes(name)) {
      if (rawValue && !isMultipleOf1000(rawValue)) {
        setErrors((prev) => ({ ...prev, [name]: 'Số này phải là bội của 1000' }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }
  };

  // Tính toán lợi nhuận, giá trị thặng dư và lợi nhuận tương lai
  const calculateProfit = () => {
    const { revenue, laborCost, materialCost, depreciation, otherCosts, reinvestmentRate, returnRate } = formData;
    if (!revenue || !laborCost || !materialCost || !depreciation || !otherCosts || !reinvestmentRate || !returnRate) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const rev = parseInt(revenue.replace(/\D/g, ''), 10);
    const labor = parseInt(laborCost.replace(/\D/g, ''), 10);
    const material = parseInt(materialCost.replace(/\D/g, ''), 10);
    const dep = parseInt(depreciation.replace(/\D/g, ''), 10);
    const other = parseInt(otherCosts.replace(/\D/g, ''), 10);
    const reinvestRate = parseFloat(reinvestmentRate) / 100;
    const retRate = parseFloat(returnRate) / 100;

    if ([rev, labor, material, dep, other].some((val) => val % 1000 !== 0)) {
      alert('Tất cả các giá trị chi phí và doanh thu phải là bội của 1000');
      return;
    }

    // Tính giá trị thặng dư (doanh thu - chi phí lương)
    const surplus = rev - labor;
    setSurplusValue(surplus);

    // Tính lợi nhuận hiện tại
    const totalCost = labor + material + dep + other;
    const calculatedProfit = rev - totalCost;
    setProfit(calculatedProfit);

    // Tính lợi nhuận tương lai từ tái đầu tư
    const reinvestment = calculatedProfit * reinvestRate;
    const futureProfitValue = reinvestment * retRate;
    setFutureProfit(futureProfitValue);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Công cụ tính lợi nhuận và giá trị thặng dư</h1>
        <p>Tính toán lợi nhuận, giá trị thặng dư và tác động của tái đầu tư trong nền kinh tế thị trường</p>
      </header>
      <main className="app-main">
        <section className="input-form">
          <h2>Nhập thông tin (tính theo VNĐ)</h2>
          <div className="input-group">
            <label htmlFor="revenue">Doanh thu</label>
            <input
              type="text"
              id="revenue"
              name="revenue"
              value={formatNumber(formData.revenue)}
              onChange={handleChange}
              placeholder="Nhập doanh thu"
            />
            {errors.revenue && <p className="error">{errors.revenue}</p>}
          </div>
          <div className="input-group">
            <label htmlFor="laborCost">Chi phí lương công nhân</label>
            <input
              type="text"
              id="laborCost"
              name="laborCost"
              value={formatNumber(formData.laborCost)}
              onChange={handleChange}
              placeholder="Nhập chi phí lương công nhân"
            />
            {errors.laborCost && <p className="error">{errors.laborCost}</p>}
          </div>
          <div className="input-group">
            <label htmlFor="materialCost">Chi phí nguyên vật liệu</label>
            <input
              type="text"
              id="materialCost"
              name="materialCost"
              value={formatNumber(formData.materialCost)}
              onChange={handleChange}
              placeholder="Nhập chi phí nguyên vật liệu"
            />
            {errors.materialCost && <p className="error">{errors.materialCost}</p>}
          </div>
          <div className="input-group">
            <label htmlFor="depreciation">Chi phí khấu hao máy móc</label>
            <input
              type="text"
              id="depreciation"
              name="depreciation"
              value={formatNumber(formData.depreciation)}
              onChange={handleChange}
              placeholder="Nhập chi phí khấu hao máy móc"
            />
            {errors.depreciation && <p className="error">{errors.depreciation}</p>}
          </div>
          <div className="input-group">
            <label htmlFor="otherCosts">Chi phí khác</label>
            <input
              type="text"
              id="otherCosts"
              name="otherCosts"
              value={formatNumber(formData.otherCosts)}
              onChange={handleChange}
              placeholder="Nhập chi phí khác"
            />
            {errors.otherCosts && <p className="error">{errors.otherCosts}</p>}
          </div>
          <div className="input-group">
            <label htmlFor="reinvestmentRate">Tỷ lệ tái đầu tư (%)</label>
            <input
              type="text"
              id="reinvestmentRate"
              name="reinvestmentRate"
              value={formData.reinvestmentRate}
              onChange={handleChange}
              placeholder="Nhập tỷ lệ tái đầu tư (ví dụ: 50 cho 50%)"
            />
          </div>
          <div className="input-group">
            <label htmlFor="returnRate">Tỷ lệ sinh lời (%)</label>
            <input
              type="text"
              id="returnRate"
              name="returnRate"
              value={formData.returnRate}
              onChange={handleChange}
              placeholder="Nhập tỷ lệ sinh lời (ví dụ: 10 cho 10%)"
            />
          </div>
          <button className="calculate-button" onClick={calculateProfit}>
            Tính toán
          </button>
        </section>
        {profit !== null && surplusValue !== null && futureProfit !== null && (
          <section className="result-section">
            <h2>Kết quả tính toán</h2>
            <h5>Giá trị thặng dư: {surplusValue.toLocaleString('vi-VN')} VNĐ</h5>
            <p className={profit >= 0 ? 'profit-positive' : 'profit-negative'}>
              Lợi nhuận hiện tại: {profit.toLocaleString('vi-VN')} VNĐ
            </p>
            <h5>Lợi nhuận tương lai từ tái đầu tư: {futureProfit.toLocaleString('vi-VN')} VNĐ</h5>
            <div className="analysis">
              <h3>Phân tích tính bền vững và công bằng</h3>
              <p>
                Trong nền kinh tế thị trường, giá trị thặng dư ({surplusValue.toLocaleString('vi-VN')} VNĐ) có thể được sử dụng để tái đầu tư, 
                như ví dụ trên với lợi nhuận tương lai là {futureProfit.toLocaleString('vi-VN')} VNĐ. Điều này thúc đẩy tăng trưởng kinh tế. 
                Tuy nhiên, nếu lợi nhuận chỉ tập trung vào tay một số ít người giàu có mà không có chính sách phân phối lại (như thuế lũy tiến 
                hoặc đầu tư vào phúc lợi xã hội), sự tăng trưởng này có thể không bền vững và làm gia tăng bất bình đẳng. Để đảm bảo công bằng, 
                cần cân nhắc tái đầu tư vào giáo dục, y tế và hỗ trợ các tầng lớp lao động.
              </p>
            </div>
          </section>
        )}
      </main>
      <footer className="app-footer">
        <p>Copyright © 2025 Nguyễn Quốc Đạt Originals</p>
      </footer>
    </div>
  );
};

export default App;