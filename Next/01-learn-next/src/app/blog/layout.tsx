interface layoutProps {
  children: React.ReactNode;
}

const layout: React.FC<layoutProps> = ({ children }) => {
  return (
    <div>
      <h2>Posts</h2>
      {children}
    </div>
  );
};

export default layout;
