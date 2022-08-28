import NoteList from "../../components/note/NoteList";

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
            <NoteList />
          </div>
      </div>
    </>
  );
};

export default User;
