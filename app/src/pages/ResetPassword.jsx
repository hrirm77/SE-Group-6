import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState(1);

  const handleRequestReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/users/reset-password', { email });
      toast.success(res.data.message);
      if (res.data.token) {
        toast.info(`Test Token (Normally Emailed): ${res.data.token}`, { autoClose: false });
      }
      setStep(2);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/api/users/reset-password/${token}`, { password });
      toast.success(res.data.message);
      setStep(1);
      setEmail('');
      setToken('');
      setPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <section className="heading">
      <h1>Reset Password</h1>
      {step === 1 ? (
        <form onSubmit={handleRequestReset}>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <button className="btn btn-block">Request Reset Link</button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Enter reset token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password (min 8 chars)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          <div className="form-group">
            <button className="btn btn-block">Reset Password</button>
          </div>
        </form>
      )}
    </section>
  );
}

export default ResetPassword;
