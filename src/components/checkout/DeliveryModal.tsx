import React from 'react';
import { Country, State, City } from 'country-state-city';
import type { DeliveryInfo } from '../../types/order';

interface Props {
  value: DeliveryInfo;
  onChange: (v: DeliveryInfo) => void;
  onSave: (v: DeliveryInfo) => void;
  onClose: () => void;
}

const DeliveryModal: React.FC<Props> = ({ value, onChange, onSave, onClose }) => {
  const allCountries = Country.getAllCountries();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl w-full max-w-2xl shadow-lg overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-semibold mb-4">Delivery Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input placeholder="Full Name" className="border rounded-lg p-2 dark:bg-gray-700 dark:text-white" value={value.fullName} onChange={(e) => onChange({...value, fullName: e.target.value})} />
          <input placeholder="Email" className="border rounded-lg p-2 dark:bg-gray-700 dark:text-white" value={value.email} onChange={(e) => onChange({...value, email: e.target.value})} />

          <div className="flex gap-2">
            <select className="border rounded-lg p-2 dark:bg-gray-700 dark:text-white" value={value.phoneCode} onChange={(e)=> onChange({...value, phoneCode: e.target.value})} aria-label="Country phone code">
              <option value="">Code</option>
              {allCountries.map(c => (<option key={c.isoCode} value={c.phonecode ?? ''}>{c.flag ?? c.isoCode} {c.name} ({c.phonecode ?? ''})</option>))}
            </select>
            <input placeholder="Phone number" className="border rounded-lg p-2 flex-1 dark:bg-gray-700 dark:text-white" value={value.phone} onChange={(e)=> onChange({...value, phone: e.target.value})} />
          </div>

          <select className="border rounded-lg p-2 dark:bg-gray-700 dark:text-white" value={value.countryIso} onChange={(e)=>{ const iso = e.target.value; const c = Country.getCountryByCode(iso); onChange({...value, countryIso: iso, countryName: c?.name || '', stateIso:'', stateName:'', cityName: ''})}} aria-label="Country">
            <option value="">Select Country</option>
            {allCountries.map(c=> (<option key={c.isoCode} value={c.isoCode}>{c.name}</option>))}
          </select>

          <select className="border rounded-lg p-2 dark:bg-gray-700 dark:text-white" value={value.stateIso} onChange={(e)=>{ const sIso = e.target.value; const stateObj = State.getStateByCodeAndCountry(sIso, value.countryIso); onChange({...value, stateIso: sIso, stateName: stateObj?.name ?? '', cityName: ''}) }} disabled={!value.countryIso} aria-label="State">
            <option value="">{value.countryIso ? 'Select State' : 'Select Country first'}</option>
            {value.countryIso && State.getStatesOfCountry(value.countryIso).map(s => (<option key={s.isoCode} value={s.isoCode}>{s.name}</option>))}
          </select>

          <select className="border rounded-lg p-2 dark:bg-gray-700 dark:text-white" value={value.cityName} onChange={(e)=> onChange({...value, cityName: e.target.value})} disabled={!value.stateIso} aria-label="City">
            <option value="">{value.stateIso ? 'Select City' : 'Select State first'}</option>
            {value.countryIso && value.stateIso && City.getCitiesOfState(value.countryIso, value.stateIso).map(ct => (<option key={ct.name} value={ct.name}>{ct.name}</option>))}
          </select>
        </div>

        <div className="mt-4 flex gap-3">
          <button onClick={()=> onSave(value)} className="bg-primary text-white py-2 px-4 rounded-lg">Save & Close</button>
          <button onClick={onClose} className="bg-red-600 text-white py-2 px-4 rounded-lg">Close</button>
        </div>
      </div>
    </div>
  );
}

export default DeliveryModal;
