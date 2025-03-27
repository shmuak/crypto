import { useState } from 'react';
import AddAssetForm from '../addForm';
import './addAssetButton.scss'
const AddAssetButton = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowForm(true)}
        className="add-button"
      >
        Добавить
      </button>
      
      <AddAssetForm 
        show={showForm} 
        onClose={() => setShowForm(false)} 
      />
    </>
  );
};

export default AddAssetButton;