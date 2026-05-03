import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function NutritionGoals() {
  const [goals, setGoals] = useState({
    calorieGoal: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Fetch user to pre-fill goals
    const fetchMe = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const API_URL = process.env.REACT_APP_API_URL || '';
        const res = await axios.get(`${API_URL}/api/users/me`, config);
        if (res.data.nutritionGoals) {
          setGoals({
            calorieGoal: res.data.nutritionGoals.calorieGoal || '',
            protein: res.data.nutritionGoals.protein || '',
            carbs: res.data.nutritionGoals.carbs || '',
            fat: res.data.nutritionGoals.fat || ''
          });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchMe();
  }, [user, navigate]);

  const onChange = (e) => {
    setGoals((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const API_URL = process.env.REACT_APP_API_URL || '';
      await axios.post(`${API_URL}/api/users/nutrition`, {
        calorieGoal: Number(goals.calorieGoal),
        protein: Number(goals.protein),
        carbs: Number(goals.carbs),
        fat: Number(goals.fat)
      }, config);
      toast.success('Nutrition goals saved!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save goals');
    }
  };

  const onClear = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const API_URL = process.env.REACT_APP_API_URL || '';
      await axios.delete(`${API_URL}/api/users/nutrition`, config);
      setGoals({ calorieGoal: '', protein: '', carbs: '', fat: '' });
      toast.success('Nutrition goals cleared!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to clear goals');
    }
  };

  return (
    <section className="heading">
      <h1>Nutrition Goals</h1>
      <p>Set your daily macro targets</p>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Calorie Goal</label>
          <input type="number" className="form-control" name="calorieGoal" value={goals.calorieGoal} onChange={onChange} required min="1000" max="3500" />
        </div>
        <div className="form-group">
          <label>Protein (g)</label>
          <input type="number" className="form-control" name="protein" value={goals.protein} onChange={onChange} required min="0" />
        </div>
        <div className="form-group">
          <label>Carbohydrates (g)</label>
          <input type="number" className="form-control" name="carbs" value={goals.carbs} onChange={onChange} required min="0" />
        </div>
        <div className="form-group">
          <label>Fat (g)</label>
          <input type="number" className="form-control" name="fat" value={goals.fat} onChange={onChange} required min="0" />
        </div>
        <div className="form-group" style={{display: 'flex', gap: '10px'}}>
          <button className="btn btn-block" type="submit" style={{flex: 1}}>Save Goals</button>
          <button className="btn btn-block" type="button" onClick={onClear} style={{flex: 1, backgroundColor: '#dc3545'}}>Clear Goals</button>
        </div>
      </form>
    </section>
  );
}

export default NutritionGoals;
