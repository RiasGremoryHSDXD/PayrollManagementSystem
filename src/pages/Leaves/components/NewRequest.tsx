import '../css/NewRequest.css'
import { useState } from 'react';
import RequestForm from './RequestForm';
export default function NewRequest() {
  const [newRequest, setNewRequest] = useState<boolean>(false);

  const handleNewRequest = () => {
    setNewRequest(!newRequest);
  }
  return (
    <div className="new-request-container">
      <button onClick={handleNewRequest}>+ New Request</button>
      {newRequest && <RequestForm/>}
    </div>
  )
}
