import { useAuth } from '../context/AuthContext';

function NewInboxPage() {

    const {user} = useAuth();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Real-Time Inbox</h1>

       
    </div>
  );
}

export default NewInboxPage;
