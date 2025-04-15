import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from "../../components/Sidebar"; 
import "./AddAdminForm.css";

const AddAdminForm = () => {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        email: '',
        password: '',
        confirm_password: '',
        role: 'staff'
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [usernameError, setUsernameError] = useState(null);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const checkUsernameAvailability = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/check-username', { username: formData.username });
            if (!response.data.available) {
                setUsernameError('El nombre de usuario ya está en uso');
            } else {
                setUsernameError(null);
            }
        } catch (error) {
            console.error("Error al verificar el nombre de usuario:", error);
        }
    };

    const clearForm = () => {
        setFormData({
            first_name: '',
            last_name: '',
            username: '',
            email: '',
            password: '',
            confirm_password: '',
            role: 'staff'
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (usernameError) {
            setError('Por favor, elige un nombre de usuario diferente.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/register", formData);
            if (response.status === 201) {
                alert('Administrador agregado con éxito');
                clearForm();
                setFormSubmitted(true); 
                navigate('/admin/admin-colab');
            }
        } catch (error) {
            setError('Error al agregar el administrador');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/admin/admin-colab');
    };

    useEffect(() => {
        if (formSubmitted) {
            setFormData({
                first_name: '',
                last_name: '',
                username: '',
                email: '',
                password: '',
                confirm_password: '',
                role: 'staff'
            });
            setFormSubmitted(false);
        }
    }, [formSubmitted]);

    return (
        <div className="main-container">
            <Sidebar />
            <div className="content">
                <div className="add-admin-form-container">
                    <h2>Agregar Administrador</h2>
                    {error && <p className="error">{error}</p>}
                    {usernameError && <p className="error">{usernameError}</p>}
                    <form onSubmit={handleSubmit} className="add-admin-form">
                        <div className="form-group">
                            <label htmlFor="first_name">Nombre</label>
                            <input
                                type="text"
                                id="first_name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="last_name">Apellido</label>
                            <input
                                type="text"
                                id="last_name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="username">Usuario</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                onBlur={checkUsernameAvailability}
                                required
                                autoComplete="off"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Contraseña</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                autoComplete="off"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirm_password">Confirmar Contraseña</label>
                            <input
                                type="password"
                                id="confirm_password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Rol</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                required
                            >
                                <option value="staff">Staff</option>
                                <option value="admin">Administrador</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <button type="submit" disabled={loading}>
                                {loading ? 'Cargando...' : 'Agregar Administrador'}
                            </button>
                        </div>

                        <div className="form-group">
                            <button type="button" className="cancel-button" onClick={handleCancel}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAdminForm;
