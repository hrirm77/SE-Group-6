import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { toast } from 'react-toastify'
import Spinner from '../components/Spinner'

function Profile() {
    const navigate = useNavigate()
    const { user } = useSelector((state) => state.auth)

    const [weight, setWeight] = useState('')
    const [diet, setDiet] = useState('')
    const [dietList, setDietList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
      if (!user) {
        navigate('/login')
        return
      }
      
      const fetchProfile = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const API_URL = process.env.REACT_APP_API_URL || '';
          const res = await axios.get(`${API_URL}/api/users/me`, config);
          if (res.data.weight) setWeight(res.data.weight);
          if (res.data.dietaryPreferences) setDietList(res.data.dietaryPreferences);
        } catch (error) {
          toast.error('Failed to load profile');
        } finally {
          setLoading(false);
        }
      }
      fetchProfile();
    }, [user, navigate])

    const handleSaveProfile = async (e) => {
      e.preventDefault();
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const API_URL = process.env.REACT_APP_API_URL || '';
        await axios.put(`${API_URL}/api/users/profile`, { weight: Number(weight), dietaryPreferences: dietList }, config);
        toast.success('Profile updated successfully!');
      } catch (error) {
        toast.error('Failed to update profile');
      }
    }

    const addDiet = () => {
      if (diet && !dietList.includes(diet)) {
        setDietList([...dietList, diet]);
        setDiet('');
      }
    }

    const removeDiet = (item) => {
      setDietList(dietList.filter(d => d !== item));
    }

    if (loading) return <Spinner />

  return (
    <div className='grid' style={{display: 'flex', justifyContent: 'center', marginTop: '40px'}}>
        <div className="box box-2" style={{width: '100%', maxWidth: '600px'}}>
          <div className="box-2-header" style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
            <div className="circle">
              <h1>{user?.name?.[0]?.toUpperCase()}</h1>
            </div>
            <div>
              <h2 style={{color: 'white'}}>{user?.name}</h2>
              <p style={{color: '#aaa'}}>{user?.email}</p>
            </div>
          </div>
          
          <div className="box-2-content" style={{marginTop: '30px', textAlign: 'left'}}>
            <h3>Update Profile</h3>
            <form onSubmit={handleSaveProfile} style={{marginTop: '15px'}}>
              <div className="form-group">
                <label>Current Weight (lbs)</label>
                <input 
                  type="number" 
                  className="form-control" 
                  value={weight} 
                  onChange={(e) => setWeight(e.target.value)} 
                  placeholder="e.g. 150"
                />
              </div>

              <div className="form-group">
                <label>Dietary Preferences (e.g. Vegan, Keto)</label>
                <div style={{display: 'flex', gap: '10px', marginBottom: '10px'}}>
                  <input 
                    type="text" 
                    className="form-control" 
                    value={diet} 
                    onChange={(e) => setDiet(e.target.value)} 
                    placeholder="Add a preference..."
                  />
                  <button type="button" className="btn" onClick={addDiet}>Add</button>
                </div>
                {dietList.length > 0 && (
                  <ul style={{listStyle: 'none', padding: 0, display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                    {dietList.map((item, index) => (
                      <li key={index} style={{background: '#007BFF', color: 'white', padding: '5px 15px', borderRadius: '20px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px'}}>
                        {item} 
                        <span style={{cursor: 'pointer', fontWeight: 'bold'}} onClick={() => removeDiet(item)}>x</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <button className="btn btn-block" type="submit" style={{marginTop: '20px'}}>Save Profile</button>
            </form>
          </div>
        </div>
    </div>
  )
}

export default Profile