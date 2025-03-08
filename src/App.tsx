import React, { useState } from 'react';
import './App.scss';

interface AppState {
  giaTriHangHoa: string;
  tuBanBatBien: string;
  tuBanKhaBien: string;
  giaTriThangDu: number;
  tySuatLoiNhuan: number;
  error: string;
  showModal: boolean;
}

const formatNumber = (value: string) => {
  const numericValue = parseFloat(value.replace(/[^0-9]/g, '')) || 0;
  return numericValue.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const removeNonNumeric = (value: string) => {
  return value.replace(/[^0-9]/g, '');
};

const isMultipleOfThousand = (value: number) => {
  return value % 1000 === 0;
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    giaTriHangHoa: '',
    tuBanBatBien: '',
    tuBanKhaBien: '',
    giaTriThangDu: 0,
    tySuatLoiNhuan: 0,
    error: '',
    showModal: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const cleanValue = removeNonNumeric(value);
    const numericValue = parseInt(cleanValue, 10) || 0;

    if (cleanValue && numericValue > 0 && !isMultipleOfThousand(numericValue)) {
      setState((prevState) => ({
        ...prevState,
        error: 'Giá trị phải là bội số của 1 nghìn',
        [name]: formatNumber(cleanValue),
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: formatNumber(cleanValue),
        error: '',
      }));
    }
  };

  const calculateProfit = () => {
    const giaTriHangHoa = parseInt(removeNonNumeric(state.giaTriHangHoa), 10) || 0;
    const tuBanBatBien = parseInt(removeNonNumeric(state.tuBanBatBien), 10) || 0;
    const tuBanKhaBien = parseInt(removeNonNumeric(state.tuBanKhaBien), 10) || 0;
    
    const giaTriThangDu = giaTriHangHoa - tuBanBatBien - tuBanKhaBien;
    const tongTuBan = tuBanBatBien + tuBanKhaBien;
    const tySuatLoiNhuan = tongTuBan !== 0 ? (giaTriThangDu / tongTuBan) * 100 : 0;

    setState((prevState) => ({
      ...prevState,
      giaTriThangDu,
      tySuatLoiNhuan,
    }));
  };

  const toggleModal = () => {
    setState((prevState) => ({
      ...prevState,
      showModal: !prevState.showModal,
    }));
  };

  const formatResultNumber = (number: number) => {
    const [integerPart, decimalPart] = number.toFixed(2).split('.');
    return `${integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}${
      decimalPart ? ',' + decimalPart : ''
    }`;
  };

  return (
    <div className="app">
      <div className="container">
        <h1>Công cụ tính giá trị thặng dư và tỷ suất lợi nhuận</h1>
        {state.error && <p className="error">{state.error}</p>}
        <div className="input-group">
          <label htmlFor="giaTriHangHoa">Giá trị hàng hóa:</label>
          <input 
            type="text" 
            id="giaTriHangHoa" 
            name="giaTriHangHoa" 
            value={state.giaTriHangHoa} 
            onChange={handleChange}
            placeholder="Nhập số (bội của 1.000)"
          />
        </div>
        <div className="input-group">
          <label htmlFor="tuBanBatBien">Chi phí tư bản bất biến (C):</label>
          <input 
            type="text" 
            id="tuBanBatBien" 
            name="tuBanBatBien" 
            value={state.tuBanBatBien} 
            onChange={handleChange}
            placeholder="Nhập số (bội của 1.000)"
          />
        </div>
        <div className="input-group">
          <label htmlFor="tuBanKhaBien">Chi phí tư bản khả biến (V):</label>
          <input 
            type="text" 
            id="tuBanKhaBien" 
            name="tuBanKhaBien" 
            value={state.tuBanKhaBien} 
            onChange={handleChange}
            placeholder="Nhập số (bội của 1.000)"
          />
        </div>
        <button onClick={calculateProfit} disabled={!!state.error}>Tính toán</button>
        <button className="explain-button" onClick={toggleModal}>Giải thích công thức</button>
        <div className="result">
          <h2>Kết quả</h2>
          <p>Giá trị thặng dư (m): {formatResultNumber(state.giaTriThangDu)}</p>
          <p>Tỷ suất lợi nhuận (p'): {formatResultNumber(state.tySuatLoiNhuan)}%</p>
        </div>
      </div>

      {state.showModal && (
        <div className="modal">
          <div className="modal-content">
            <button onClick={toggleModal}>×</button>
            <h2>Giải thích công thức</h2>
            <p><strong>1. Giá trị thặng dư (m):</strong></p>
            <p>Công thức: m = Giá trị hàng hóa - C - V</p>
            <p>Trong đó:</p>
            <ul>
              <li>C: Chi phí tư bản bất biến (vốn cố định như máy móc, nhà xưởng)</li>
              <li>V: Chi phí tư bản khả biến (tiền lương trả cho công nhân)</li>
            </ul>
            <p>Giá trị thặng dư là phần giá trị mới do sức lao động tạo ra vượt trên giá trị sức lao động.</p>
            
            <p><strong>2. Tỷ suất lợi nhuận (p'): </strong></p>
            <p>Công thức: p' = (m / (C + V)) × 100%</p>
            <p>Tỷ suất lợi nhuận thể hiện mức độ sinh lời của tổng vốn ứng trước (C + V).</p>
            
            <p><strong>Ví dụ:</strong></p>
            <p>Nếu: Giá trị hàng hóa = 10.000; C = 4.000; V = 3.000</p>
            <p>Thì: m = 10.000 - 4.000 - 3.000 = 3.000</p>
            <p>p' = (3.000 / (4.000 + 3.000)) × 100% = 42,86%</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;