import { prismaClient } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    // TODO: Can get rid of the DB call here
    const user = await prismaClient.user.findFirst({
      where: {
        email: session?.user?.email ?? ""
      }
    });

    if (!user) {
      return NextResponse.json({
        message: "Unauthorized"
      }, {
        status: 403
      });
    }

    const streams = await prismaClient.stream.findMany({
      where: {
        userId: user.id ?? "",
      },
      include: {
        _count: {
          select: {
            upvotes: {
              where: {
                userId: user.id,
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      streams: streams.map(({_count, ...rest}) => ({
        ...rest,
        upvotes: _count.upvotes,
        haveUpvoted: rest.upvotes.length ? true : false
      }))
    });
  } catch (error) {
    console.error("Error fetching streams:", error);
    return NextResponse.json({
      message: "Internal Server Error"
    }, {
      status: 500
    });
  }
}