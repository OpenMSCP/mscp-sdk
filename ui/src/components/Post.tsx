import React, { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useSdk } from "../context/SdkContext";

const Post: React.FC = () => {
  const { publicKey } = useWallet();
  const { sdk } = useSdk();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePost = async () => {
    if (!publicKey || !sdk) return;

    try {
      setLoading(true);
      setError(null);

      // Create post using SDK
      await sdk.post.createPost({
        content,
        authority: publicKey,
      });

      // Reset form
      setContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Create Post</h2>
      {publicKey ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="What's on your mind?"
            />
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            onClick={handleCreatePost}
            disabled={loading || !content}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Posting..." : "Post"}
          </button>
        </div>
      ) : (
        <p className="text-gray-500">
          Please connect your wallet to create a post
        </p>
      )}
    </div>
  );
};

export default Post;
