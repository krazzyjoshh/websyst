import React, { useState, useEffect } from 'react';

export default function PHAddressSelect({ data, setData, errors }) {
    const [regions, setRegions] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [cities, setCities] = useState([]);
    const [barangays, setBarangays] = useState([]);

    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');

    // Fetch Regions on mount
    useEffect(() => {
        fetch('https://psgc.gitlab.io/api/regions/')
            .then(res => res.json())
            .then(data => {
                // Sort by name
                const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
                setRegions(sorted);
            })
            .catch(err => console.error('Error fetching regions:', err));
    }, []);

    // Fetch Provinces when Region changes
    useEffect(() => {
        setProvinces([]);
        setCities([]);
        setBarangays([]);
        if (selectedRegion) {
            fetch(`https://psgc.gitlab.io/api/regions/${selectedRegion}/provinces/`)
                .then(res => res.json())
                .then(data => {
                    const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
                    setProvinces(sorted);
                    // If no provinces (like NCR), fetch cities directly from region
                    if (data.length === 0) {
                        fetch(`https://psgc.gitlab.io/api/regions/${selectedRegion}/cities-municipalities/`)
                            .then(res => res.json())
                            .then(cityData => {
                                const sortedCities = cityData.sort((a, b) => a.name.localeCompare(b.name));
                                setCities(sortedCities);
                            });
                    }
                })
                .catch(err => console.error('Error fetching provinces:', err));
        }
    }, [selectedRegion]);

    // Fetch Cities when Province changes
    useEffect(() => {
        setCities([]);
        setBarangays([]);
        if (selectedProvince) {
            fetch(`https://psgc.gitlab.io/api/provinces/${selectedProvince}/cities-municipalities/`)
                .then(res => res.json())
                .then(data => {
                    const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
                    setCities(sorted);
                })
                .catch(err => console.error('Error fetching cities:', err));
        }
    }, [selectedProvince]);

    // Fetch Barangays when City changes
    useEffect(() => {
        setBarangays([]);
        if (selectedCity) {
            fetch(`https://psgc.gitlab.io/api/cities-municipalities/${selectedCity}/barangays/`)
                .then(res => res.json())
                .then(data => {
                    const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
                    setBarangays(sorted);
                })
                .catch(err => console.error('Error fetching barangays:', err));
        }
    }, [selectedCity]);

    const handleRegionChange = (e) => {
        const code = e.target.value;
        const name = e.target.options[e.target.selectedIndex].text;
        setSelectedRegion(code);
        setSelectedProvince('');
        setSelectedCity('');
        setData(prev => ({
            ...prev,
            province: name, // We store region name if NCR, else it gets overwritten by province
            city: '',
            barangay: ''
        }));
    };

    const handleProvinceChange = (e) => {
        const code = e.target.value;
        const name = e.target.options[e.target.selectedIndex].text;
        setSelectedProvince(code);
        setSelectedCity('');
        setData(prev => ({
            ...prev,
            province: name,
            city: '',
            barangay: ''
        }));
    };

    const handleCityChange = (e) => {
        const code = e.target.value;
        const name = e.target.options[e.target.selectedIndex].text;
        setSelectedCity(code);
        setData(prev => ({
            ...prev,
            city: name,
            barangay: ''
        }));
    };

    const handleBarangayChange = (e) => {
        const name = e.target.options[e.target.selectedIndex].text;
        setData(prev => ({
            ...prev,
            barangay: name
        }));
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
                <label>Region *</label>
                <select
                    className="form-input"
                    value={selectedRegion}
                    onChange={handleRegionChange}
                >
                    <option value="">Select Region</option>
                    {regions.map(r => (
                        <option key={r.code} value={r.code}>{r.name}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Province *</label>
                <select
                    className={`form-input ${errors.province ? 'form-input--error' : ''}`}
                    value={selectedProvince}
                    onChange={handleProvinceChange}
                    disabled={provinces.length === 0}
                >
                    <option value="">{provinces.length === 0 ? 'N/A' : 'Select Province'}</option>
                    {provinces.map(p => (
                        <option key={p.code} value={p.code}>{p.name}</option>
                    ))}
                </select>
                {errors.province && <span className="form-error">{errors.province}</span>}
            </div>

            <div className="form-group">
                <label>City / Municipality *</label>
                <select
                    className={`form-input ${errors.city ? 'form-input--error' : ''}`}
                    value={selectedCity}
                    onChange={handleCityChange}
                    disabled={cities.length === 0}
                >
                    <option value="">Select City / Municipality</option>
                    {cities.map(c => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                </select>
                {errors.city && <span className="form-error">{errors.city}</span>}
            </div>

            <div className="form-group">
                <label>Barangay / District *</label>
                <select
                    className={`form-input ${errors.barangay ? 'form-input--error' : ''}`}
                    value={data.barangay ? data.barangay + '_hack' : ''} // Small hack to keep value when searching
                    onChange={handleBarangayChange}
                    disabled={barangays.length === 0}
                >
                    <option value="">Select Barangay</option>
                    {barangays.map(b => (
                        <option key={b.code} value={b.name + '_hack'}>{b.name}</option>
                    ))}
                </select>
                {errors.barangay && <span className="form-error">{errors.barangay}</span>}
            </div>
        </div>
    );
}
