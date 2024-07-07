import Layout from '../components/layout';

const Home: React.FC = () => {
  return (
    <Layout>
      <div>
        <h1 className="text-2xl font-bold">Welcome to your dashboard!</h1>
        <p>This is your main content area.</p>
      </div>
    </Layout>
  );
};

export default Home;
