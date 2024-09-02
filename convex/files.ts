import { handler } from "tailwindcss-animate";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { ConvexError, v } from "convex/values";
import { getUser } from "./users";




export const generateUploadUrl = mutation(async (ctx) => {
  const identity=await ctx.auth.getUserIdentity()


  if(!identity){
    throw new ConvexError(" No user is identitified ")
  }
  return await ctx.storage.generateUploadUrl();
});

async function hasAccesstoOrg(
  ctx: QueryCtx | MutationCtx,
  tokenIdentifier: string,
  orgId: string
) {
  const user = await getUser(ctx, tokenIdentifier);

  const hasAccess =
    user.orgIds.includes(orgId) || user.tokenIdentifier.includes(orgId);

  return hasAccess;
}
export const createFile = mutation({
  args: {
    name: v.string(),
    fileId:v.id("_storage"),
    orgId: v.string(),
    
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("You must be logged in to create  file");
    }

    const hasAccess = await hasAccesstoOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    );

    if (!hasAccess) {
      throw new ConvexError("You do not have access to the content.");
    }

    await ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId,
      fileId:args.fileId
      
    
    });
  },
});

export const getFiles = query({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      return [];
    }

    const hasAccess = await hasAccesstoOrg(
      ctx,
      identity.tokenIdentifier,
      args.orgId
    );

    if (!hasAccess) {
      return [];
    }

    return ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect();
  },
});
