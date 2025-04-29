import React, { useState } from "react";
import { WalletWrapper } from "./components/WalletProvider";
import { SolanaProvider, useSolana } from "./contexts/SolanaContext";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

function App() {
  return (
    <WalletWrapper>
      <SolanaProvider>
        <div className="App">
          <header>
            <h1>MSCP Social Platform</h1>
            <WalletMultiButton />
          </header>
          <main>
            <ProfileSection />
            <PostSection />
          </main>
        </div>
      </SolanaProvider>
    </WalletWrapper>
  );
}

const ProfileSection: React.FC = () => {
  const { publicKey } = useWallet();
  const { createProfile, updateProfile } = useSolana();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState("");

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProfile(username, bio, profilePicture);
      alert("Profile created successfully!");
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("Failed to create profile");
    }
  };

  if (!publicKey) {
    return <p>Please connect your wallet to create a profile</p>;
  }

  return (
    <section>
      <h2>Create Profile</h2>
      <form onSubmit={handleCreateProfile}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <textarea
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
        <input
          type="text"
          placeholder="Profile Picture URL"
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
        />
        <button type="submit">Create Profile</button>
      </form>
    </section>
  );
};

const PostSection: React.FC = () => {
  const { publicKey } = useWallet();
  const { createPost } = useSolana();
  const [content, setContent] = useState("");

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPost(content);
      setContent("");
      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post");
    }
  };

  if (!publicKey) {
    return <p>Please connect your wallet to create posts</p>;
  }

  return (
    <section>
      <h2>Create Post</h2>
      <form onSubmit={handleCreatePost}>
        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
    </section>
  );
};

export default App;
