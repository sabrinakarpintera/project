import { useState, useEffect } from "react";
import "./style/MyAccount.css";

export default function MyAccount() {

  const API = "http://localhost/fuku/src/api";

  const [regions, setRegions] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");

  const [regionCode, setRegionCode] = useState("");
  const [provinceCode, setProvinceCode] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [barangayCode, setBarangayCode] = useState("");

  const [regionName, setRegionName] = useState("");
  const [provinceName, setProvinceName] = useState("");
  const [cityName, setCityName] = useState("");
  const [barangayName, setBarangayName] = useState("");

  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [editAddress, setEditAddress] = useState(false);

   const fetchSafeJSON = async (url, options = {}) => {
    try {
      const res = await fetch(url, {
        ...options,
        credentials: "include"
      });
      return await res.json();
    } catch (err) {
      console.error(err);
      return {};
    }
  };

  useEffect(() => {

    const loadUser = async () => {
      const data = await fetchSafeJSON(`${API}/get_user.php`);

      setName(data.name || "");
      setEmail(data.email || "");
      setPhone(data.phone || "");
      setStreet(data.street || "");

      setRegionName(data.region || "");
      setProvinceName(data.province || "");
      setCityName(data.city || "");
      setBarangayName(data.barangay || "");
    };

    const loadRegions = async () => {
      const res = await fetch("https://psgc.gitlab.io/api/regions/");
      const data = await res.json();
      setRegions(data);
    };

    loadUser();
    loadRegions();

  }, []);

  const handleRegion = async (e) => {

    const code = e.target.value;
    const name = e.target.selectedOptions[0].text;

    setRegionCode(code);
    setRegionName(name);

    setProvinceCode("");
    setCityCode("");
    setBarangayCode("");

    setProvinceName("");
    setCityName("");
    setBarangayName("");

    const res = await fetch(`https://psgc.gitlab.io/api/regions/${code}/provinces/`);
    const data = await res.json();

    setProvinces(data);
  };

  const handleProvince = async (e) => {

    const code = e.target.value;
    const name = e.target.selectedOptions[0].text;

    setProvinceCode(code);
    setProvinceName(name);

    setCityCode("");
    setBarangayCode("");

    setCityName("");
    setBarangayName("");

    const res = await fetch(`https://psgc.gitlab.io/api/provinces/${code}/cities-municipalities/`);
    const data = await res.json();

    setCities(data);
  };

  const handleCity = async (e) => {

    const code = e.target.value;
    const name = e.target.selectedOptions[0].text;

    setCityCode(code);
    setCityName(name);

    setBarangayCode("");
    setBarangayName("");

    const res = await fetch(`https://psgc.gitlab.io/api/cities-municipalities/${code}/barangays/`);
    const data = await res.json();

    setBarangays(data);
  };

  const handleBarangay = (e) => {

    const code = e.target.value;
    const name = e.target.selectedOptions[0].text;

    setBarangayCode(code);
    setBarangayName(name);
  };

  const saveAccount = async () => {

    const result = await fetchSafeJSON(`${API}/update_user.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        phone,
        region: regionName,
        province: provinceName,
        city: cityName,
        barangay: barangayName,
        street
      })
    });

    if (result.success) {

      alert("Account updated successfully");

      setEditName(false);
      setEditEmail(false);
      setEditPhone(false);
      setEditAddress(false);

    } else {
      alert(result.error || "Update failed");
    }

  };

  return (

    <div className="account-container">

      <h1 className="title">My Account</h1>
      <hr />

      <h2 className="section-title">Account Details</h2>

      <div className="field-row">
        <input className="input1" value={name} onChange={(e)=>setName(e.target.value)} readOnly={!editName}/>
        <button className="edit-btn" onClick={()=>setEditName(!editName)}>
          {editName ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="field-row">
        <input className="input1" value={email} onChange={(e)=>setEmail(e.target.value)} readOnly={!editEmail}/>
        <button className="edit-btn" onClick={()=>setEditEmail(!editEmail)}>
          {editEmail ? "Cancel" : "Edit"}
        </button>
      </div>

      <div className="field-row">
        <input className="input" value={phone} onChange={(e)=>setPhone(e.target.value)} readOnly={!editPhone}/>
        <button className="edit-btn" onClick={()=>setEditPhone(!editPhone)}>
          {editPhone ? "Cancel" : "Edit"}
        </button>
      </div>

      <h2 className="section-title">Address</h2>

      <select className="input" value={regionCode} onChange={handleRegion} disabled={!editAddress}>
        <option value="">Select Region</option>
        {regions.map(r=>(
          <option key={r.code} value={r.code}>{r.name}</option>
        ))}
      </select>

      <select className="input" value={provinceCode} onChange={handleProvince} disabled={!editAddress}>
        <option value="">Select Province</option>
        {provinces.map(p=>(
          <option key={p.code} value={p.code}>{p.name}</option>
        ))}
      </select>

      <select className="input" value={cityCode} onChange={handleCity} disabled={!editAddress}>
        <option value="">Select City</option>
        {cities.map(c=>(
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>

      <select className="input" value={barangayCode} onChange={handleBarangay} disabled={!editAddress}>
        <option value="">Select Barangay</option>
        {barangays.map(b=>(
          <option key={b.code} value={b.code}>{b.name}</option>
        ))}
      </select>

      <input
        className="input"
        value={street}
        onChange={(e)=>setStreet(e.target.value)}
        readOnly={!editAddress}
        placeholder="Street"
      />

      <div className="bottom-btn">

        <button className="edit-btn" onClick={()=>setEditAddress(!editAddress)}>
          {editAddress ? "Cancel" : "Edit"}
        </button>

        <button className="edit-btn" onClick={saveAccount}>
          Save
        </button>

      </div>

    </div>
  );
}