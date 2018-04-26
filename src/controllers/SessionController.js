import express from "express";

const router = express.Router();

/* Utils */
import shortid from "shortid";

import { rooms } from "../socket/socket";

import { requireLogin } from "../middleware";

const WrappedSessionController = socketMethods => (
  router.post("/", requireLogin, (req, res) => {
    const sessionId = shortid.generate();

    rooms[sessionId] = {
      session: socketMethods.getNewSession(sessionId),
      presentation: {
        owner: req.user.name,
        description: "AI in the future.",
        attendees: 0,
        engagement: {
          threshold: 3.5,
          description: "Faster, slower"
        }
      }
    };

    res.status(200).json({
      success: true,
      session: sessionId
    });
  }),
  /* Session Passthrough Route */
  router.get("/:sessionId", (req, res) => {
    const { sessionId } = req.params;

    if (!socketMethods.sessionExists(sessionId)) {
      return res.status(404).json({
        success: false,
        message: "No session found for that URL."
      });
    }

    res.status(200).json({
      success: true,
      session: sessionId
    });
  })
);

export default WrappedSessionController;