import { pgTable, text, pgSequence, pgEnum } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const role = pgEnum("role", ['member', 'admin'])
export const type = pgEnum("type", ['email', 'google', 'github', 'facebook'])

export const thurbaAccountsIdSeq = pgSequence("thurba_accounts_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaAccountsUserIdSeq = pgSequence("thurba_accounts_userId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaEventsIdSeq = pgSequence("thurba_events_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaEventsGroupIdSeq = pgSequence("thurba_events_groupId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaFollowingIdSeq = pgSequence("thurba_following_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaFollowingUserIdSeq = pgSequence("thurba_following_userId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaFollowingForeignUserIdSeq = pgSequence("thurba_following_foreignUserId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaGroupIdSeq = pgSequence("thurba_group_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaGroupUserIdSeq = pgSequence("thurba_group_userId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaInvitesIdSeq = pgSequence("thurba_invites_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaInvitesGroupIdSeq = pgSequence("thurba_invites_groupId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaMagicLinksIdSeq = pgSequence("thurba_magic_links_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaMembershipIdSeq = pgSequence("thurba_membership_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaMembershipUserIdSeq = pgSequence("thurba_membership_userId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaMembershipGroupIdSeq = pgSequence("thurba_membership_groupId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaNewsletterIdSeq = pgSequence("thurba_newsletter_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaNotificationsIdSeq = pgSequence("thurba_notifications_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaNotificationsUserIdSeq = pgSequence("thurba_notifications_userId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaNotificationsGroupIdSeq = pgSequence("thurba_notifications_groupId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaPostsIdSeq = pgSequence("thurba_posts_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaPostsUserIdSeq = pgSequence("thurba_posts_userId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaPostsGroupIdSeq = pgSequence("thurba_posts_groupId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaProfileIdSeq = pgSequence("thurba_profile_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaProfileUserIdSeq = pgSequence("thurba_profile_userId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaRepliesIdSeq = pgSequence("thurba_replies_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaRepliesUserIdSeq = pgSequence("thurba_replies_userId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaRepliesPostIdSeq = pgSequence("thurba_replies_postId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaRepliesGroupIdSeq = pgSequence("thurba_replies_groupId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaResetTokensIdSeq = pgSequence("thurba_reset_tokens_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaResetTokensUserIdSeq = pgSequence("thurba_reset_tokens_userId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaSessionUserIdSeq = pgSequence("thurba_session_userId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaSubscriptionsIdSeq = pgSequence("thurba_subscriptions_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaSubscriptionsUserIdSeq = pgSequence("thurba_subscriptions_userId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaUserIdSeq = pgSequence("thurba_user_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaVerifyEmailTokensIdSeq = pgSequence("thurba_verify_email_tokens_id_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })
export const thurbaVerifyEmailTokensUserIdSeq = pgSequence("thurba_verify_email_tokens_userId_seq", {  startWith: "1", increment: "1", minValue: "1", maxValue: "2147483647", cache: "1", cycle: false })


export const kaenUsers = pgTable("kaen_users", {
	id: text("id").primaryKey().notNull(),
});