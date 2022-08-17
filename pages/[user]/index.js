import NotesList from "../../components/NotesList";

export const getServerSideProps = ({ params }) => {
  return {
    props: {
      params,
    },
  };
};

const User = ({ params }) => {
  return (
    <>
      <div>
          <div className="wrapper m-auto max-w-8xl">
            {/* Note list component */}
            <NotesList />
          </div>
      </div>
    </>
  );
};

export default User;
