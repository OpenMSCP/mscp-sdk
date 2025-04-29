use anchor_lang::prelude::*;
use anchor_lang::solana_program::sysvar::instructions::{ID as INSTRUCTIONS_ID};
use anchor_lang::solana_program::sysvar::instructions::load_instruction_at_checked;

declare_id!("9CuK5BsFiUEF781iSYSJt1BP2xJxDLH2DrVvfoZKJAtj");

// Solana Memo Program ID
pub mod memo_program {
    use solana_program::declare_id;
    declare_id!("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
}

#[program]
pub mod openmscp {
    use super::*;

    pub fn initialize(_ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }

    // Profile Management Instructions
    
    pub fn create_profile(
        ctx: Context<CreateProfile>, 
        username: String, 
        bio: String, 
        profile_picture: String
    ) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        let user = &ctx.accounts.user;
        
        // Validate input data
        if username.len() < 3 || username.len() > 20 {
            return Err(ErrorCode::UsernameInvalid.into());
        }
        
        if bio.len() > 140 {
            return Err(ErrorCode::BioTooLong.into());
        }
        
        if profile_picture.len() > 100 {
            return Err(ErrorCode::ProfilePictureTooLong.into());
        }
        
        // Initialize profile data
        profile.owner = user.key();
        profile.username = username;
        profile.bio = bio;
        profile.profile_picture = profile_picture; // IPFS hash
        profile.created_at = Clock::get()?.unix_timestamp;
        profile.updated_at = Clock::get()?.unix_timestamp;
        
        Ok(())
    }
    
    pub fn update_profile(
        ctx: Context<UpdateProfile>, 
        bio: Option<String>, 
        profile_picture: Option<String>
    ) -> Result<()> {
        let profile = &mut ctx.accounts.profile;
        
        // Update bio if provided
        if let Some(new_bio) = bio {
            if new_bio.len() > 140 {
                return Err(ErrorCode::BioTooLong.into());
            }
            profile.bio = new_bio;
        }
        
        // Update profile picture if provided
        if let Some(new_pic) = profile_picture {
            if new_pic.len() > 100 {
                return Err(ErrorCode::ProfilePictureTooLong.into());
            }
            profile.profile_picture = new_pic;
        }
        
        // Update timestamp
        profile.updated_at = Clock::get()?.unix_timestamp;
        
        Ok(())
    }
    
    // Post Management Instructions
    
    pub fn create_post(
        ctx: Context<CreatePost>,
        content: String,
    ) -> Result<()> {
        let post = &mut ctx.accounts.post;
        let user = &ctx.accounts.user;
        
        // Validate content length
        if content.len() > 280 {
            return Err(ErrorCode::PostTooLong.into());
        }
        
        // Create a post reference that will be used to link memo data to this account
        post.author = user.key();
        post.timestamp = Clock::get()?.unix_timestamp;
        post.memo_account = ctx.accounts.memo_account.key();
        
        // Store post metadata
        let timestamp = Clock::get()?.unix_timestamp;
        
        // JSON format for the memo content that will be stored via Memo Program
        let post_data = format!(
            "{{\"type\":\"post\",\"author\":\"{}\",\"ts\":{},\"content\":\"{}\"}}",
            user.key(),
            timestamp,
            content
        );
        
        // The memo instruction is expected to be the next instruction in the transaction
        // This validation ensures the memo is properly linked to this post creation
        let instructions_sysvar = &ctx.accounts.instructions_sysvar;
        let current_ix_index = 0; // This instruction
        
        // Get the next instruction in the transaction
        let next_ix = load_instruction_at_checked(current_ix_index + 1, instructions_sysvar)?;
        
        // Verify it's a Memo Program instruction
        if next_ix.program_id != memo_program::ID {
            return Err(ErrorCode::InvalidMemoInstruction.into());
        }
        
        // Verify the memo data matches our expected format
        if next_ix.data != post_data.as_bytes() {
            return Err(ErrorCode::InvalidMemoData.into());
        }
        
        Ok(())
    }
    
    // Messaging Instructions
    
    pub fn send_message(
        ctx: Context<SendMessage>,
        encrypted_content: String,
    ) -> Result<()> {
        let message = &mut ctx.accounts.message;
        let sender = &ctx.accounts.sender;
        let recipient = &ctx.accounts.recipient_profile.owner;
        
        // Validate content length
        if encrypted_content.len() > 1000 {
            return Err(ErrorCode::MessageTooLong.into());
        }
        
        // Initialize message
        message.sender = sender.key();
        message.recipient = *recipient;
        message.encrypted_content = encrypted_content;
        message.timestamp = Clock::get()?.unix_timestamp;
        message.read = false;
        
        Ok(())
    }
    
    pub fn mark_message_read(ctx: Context<MarkMessageRead>) -> Result<()> {
        let message = &mut ctx.accounts.message;
        
        // Mark as read
        message.read = true;
        
        Ok(())
    }
}

// Account Structures

#[derive(Accounts)]
pub struct Initialize {}

#[derive(Accounts)]
pub struct CreateProfile<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + // Discriminator
                32 + // owner: Pubkey
                4 + 20 + // username: String (max 20 chars)
                4 + 140 + // bio: String (max 140 chars)
                4 + 100 + // profile_picture: String (IPFS hash)
                8 + // created_at: i64
                8, // updated_at: i64
        seeds = [b"profile", user.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, Profile>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateProfile<'info> {
    #[account(
        mut,
        seeds = [b"profile", user.key().as_ref()],
        bump,
        constraint = profile.owner == user.key() @ ErrorCode::Unauthorized
    )]
    pub profile: Account<'info, Profile>,
    
    pub user: Signer<'info>,
}

#[derive(Accounts)]
pub struct CreatePost<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + // Discriminator
                32 + // author: Pubkey
                8 +  // timestamp: i64
                32,  // memo_account: Pubkey
        seeds = [b"post", user.key().as_ref(), &Clock::get()?.unix_timestamp.to_le_bytes()],
        bump
    )]
    pub post: Account<'info, Post>,
    
    /// CHECK: This account is explicitly used to link the memo data to the post
    pub memo_account: UncheckedAccount<'info>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    #[account(address = INSTRUCTIONS_ID)]
    /// CHECK: This is the instructions sysvar
    pub instructions_sysvar: UncheckedAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SendMessage<'info> {
    #[account(
        init,
        payer = sender,
        space = 8 + // Discriminator
                32 + // sender: Pubkey
                32 + // recipient: Pubkey
                4 + 1000 + // encrypted_content: String (max 1000 chars)
                8 + // timestamp: i64
                1, // read: bool
    )]
    pub message: Account<'info, Message>,
    
    #[account(mut)]
    pub sender: Signer<'info>,
    
    #[account(
        seeds = [b"profile", recipient_profile.owner.as_ref()],
        bump,
    )]
    pub recipient_profile: Account<'info, Profile>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MarkMessageRead<'info> {
    #[account(
        mut,
        constraint = message.recipient == user.key() @ ErrorCode::Unauthorized
    )]
    pub message: Account<'info, Message>,
    
    pub user: Signer<'info>,
}

// Account Definitions

#[account]
pub struct Profile {
    pub owner: Pubkey,
    pub username: String,
    pub bio: String,
    pub profile_picture: String, // IPFS hash
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct Post {
    pub author: Pubkey,
    pub timestamp: i64,
    pub memo_account: Pubkey, // Reference to the memo account containing the post content
}

#[account]
pub struct Message {
    pub sender: Pubkey,
    pub recipient: Pubkey,
    pub encrypted_content: String,
    pub timestamp: i64,
    pub read: bool,
}

// Error codes

#[error_code]
pub enum ErrorCode {
    #[msg("Username must be between 3 and 20 characters")]
    UsernameInvalid,
    
    #[msg("Bio must be less than 140 characters")]
    BioTooLong,
    
    #[msg("Profile picture hash too long")]
    ProfilePictureTooLong,
    
    #[msg("Post content too long")]
    PostTooLong,
    
    #[msg("Message too long")]
    MessageTooLong,
    
    #[msg("Invalid memo instruction - must use Memo Program")]
    InvalidMemoInstruction,
    
    #[msg("Invalid memo data format")]
    InvalidMemoData,
    
    #[msg("Unauthorized operation")]
    Unauthorized,
}
