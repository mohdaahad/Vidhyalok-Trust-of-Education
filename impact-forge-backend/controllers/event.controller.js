import Event from "../models/Event.model.js";
import EventRegistration from "../models/EventRegistration.model.js";
import EventAgenda from "../models/EventAgenda.model.js";
import EventGallery from "../models/EventGallery.model.js";
import EventImpactMetric from "../models/EventImpactMetric.model.js";
import EventTestimonial from "../models/EventTestimonial.model.js";
import { Op } from "sequelize";
import path from "path";
import { fileURLToPath } from "url";

// Import models/index to ensure relationships are loaded
import "../models/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper function to get image URL from file path
const getImageUrl = (file) => {
  if (!file || !file.path) {
    throw new Error("File path is missing");
  }

  // Get relative path from uploads directory
  const relativePath = path.relative(path.join(__dirname, "../uploads"), file.path);
  // Convert backslashes to forward slashes for URL
  const urlPath = relativePath.replace(/\\/g, "/");

  // Return URL path (will be served as static file)
  return `/uploads/${urlPath}`;
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const events = await Event.findAll({
      where,
      order: [["date", "DESC"]],
      include: [
        {
          model: EventRegistration,
          as: "registrations",
          required: false,
        },
        {
          model: EventGallery,
          as: "gallery",
          required: false,
        },
        {
          model: EventAgenda,
          as: "agenda",
          required: false,
        },
      ],
    });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get event by ID
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        {
          model: EventRegistration,
          as: "registrations",
          required: false,
        },
        {
          model: EventGallery,
          as: "gallery",
          required: false,
          order: [["display_order", "ASC"]],
        },
        {
          model: EventAgenda,
          as: "agenda",
          required: false,
          order: [["display_order", "ASC"]],
        },
        {
          model: EventImpactMetric,
          as: "impactMetrics",
          required: false,
          order: [["display_order", "ASC"]],
        },
        {
          model: EventTestimonial,
          as: "testimonials",
          required: false,
          order: [["display_order", "ASC"]],
        },
      ],
    });

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Register for event
// @route   POST /api/events/:id/register
// @access  Private
export const registerForEvent = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    // Check if event is full
    if (event.max_participants && event.registered_count >= event.max_participants) {
      return res.status(400).json({
        success: false,
        message: "Event is full",
      });
    }

    // Check if already registered
    const existingRegistration = await EventRegistration.findOne({
      where: {
        event_id: event.id,
        participant_email: req.body.participant_email,
      },
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: "Already registered for this event",
      });
    }

    const registration = await EventRegistration.create({
      event_id: event.id,
      participant_name: req.body.participant_name,
      participant_email: req.body.participant_email,
      participant_phone: req.body.participant_phone,
      number_of_guests: req.body.number_of_guests || 1,
      special_requirements: req.body.special_requirements || null,
    });

    // Update registered count
    await event.increment("registered_count", { by: req.body.number_of_guests || 1 });

    res.status(201).json({
      success: true,
      message: "Successfully registered for event",
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my events
// @route   GET /api/events/my-events
// @access  Private
export const getMyEvents = async (req, res, next) => {
  try {
    // Get user email from authenticated user
    const userEmail = req.user?.email || req.body?.email || req.query?.email;

    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: "User email is required",
      });
    }

    const registrations = await EventRegistration.findAll({
      where: { participant_email: userEmail },
      include: [
        {
          model: Event,
          as: "event",
          required: true,
        },
      ],
      order: [[{ model: Event, as: "event" }, "date", "DESC"]],
    });

    const events = registrations.map((reg) => reg.event);

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event registration status
// @route   PUT /api/events/:id/registrations/:registrationId
// @access  Private/Admin
export const updateEventRegistrationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id, registrationId } = req.params;

    // Validate status
    const validStatuses = ["pending", "confirmed", "cancelled", "attended"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    // Find registration
    const registration = await EventRegistration.findOne({
      where: {
        id: registrationId,
        event_id: id,
      },
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: "Registration not found",
      });
    }

    // Update status
    await registration.update({ status });

    res.status(200).json({
      success: true,
      message: "Registration status updated successfully",
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res, next) => {
  try {
    let eventData = { ...req.body };

    // If image file is uploaded, get its URL
    if (req.file) {
      try {
        const imageUrl = getImageUrl(req.file);
        eventData.image_url = imageUrl;
      } catch (uploadError) {
        console.error("Image processing error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to process image",
          error: uploadError.message || "Unknown error",
        });
      }
    }

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    let updateData = { ...req.body };

    // If image file is uploaded, get its URL
    if (req.file) {
      try {
        const imageUrl = getImageUrl(req.file);
        updateData.image_url = imageUrl;
      } catch (uploadError) {
        console.error("Image processing error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to process image",
          error: uploadError.message || "Unknown error",
        });
      }
    }

    await event.update(updateData);

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    await event.destroy();

    res.status(200).json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add event agenda item
// @route   POST /api/events/:id/agenda
// @access  Private/Admin
export const addEventAgenda = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const { time, activity, display_order } = req.body;

    const agendaItem = await EventAgenda.create({
      event_id: event.id,
      time,
      activity,
      display_order: display_order || 0,
    });

    res.status(201).json({
      success: true,
      data: agendaItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get event agenda
// @route   GET /api/events/:id/agenda
// @access  Public
export const getEventAgenda = async (req, res, next) => {
  try {
    const agenda = await EventAgenda.findAll({
      where: { event_id: req.params.id },
      order: [["display_order", "ASC"], ["time", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: agenda.length,
      data: agenda,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event agenda item
// @route   DELETE /api/events/:id/agenda/:agendaId
// @access  Private/Admin
export const deleteEventAgenda = async (req, res, next) => {
  try {
    const agendaItem = await EventAgenda.findByPk(req.params.agendaId);

    if (!agendaItem) {
      return res.status(404).json({
        success: false,
        message: "Agenda item not found",
      });
    }

    await agendaItem.destroy();

    res.status(200).json({
      success: true,
      message: "Agenda item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add event gallery image
// @route   POST /api/events/:id/gallery
// @access  Private/Admin
export const addEventGalleryImage = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    let imageUrl = req.body.image_url;
    const { caption, display_order } = req.body;

    // If image file is uploaded, get its URL
    if (req.file) {
      try {
        imageUrl = getImageUrl(req.file);
      } catch (uploadError) {
        console.error("Image processing error:", uploadError);
        return res.status(500).json({
          success: false,
          message: "Failed to process image",
          error: uploadError.message || "Unknown error",
        });
      }
    }

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: "Image URL or image file is required",
      });
    }

    const galleryItem = await EventGallery.create({
      event_id: event.id,
      image_url: imageUrl,
      caption: caption || null,
      display_order: display_order || 0,
    });

    res.status(201).json({
      success: true,
      data: galleryItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get event gallery
// @route   GET /api/events/:id/gallery
// @access  Public
export const getEventGallery = async (req, res, next) => {
  try {
    const gallery = await EventGallery.findAll({
      where: { event_id: req.params.id },
      order: [["display_order", "ASC"], ["created_at", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: gallery.length,
      data: gallery,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event gallery image
// @route   DELETE /api/events/:id/gallery/:galleryId
// @access  Private/Admin
export const deleteEventGalleryImage = async (req, res, next) => {
  try {
    const galleryItem = await EventGallery.findByPk(req.params.galleryId);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery image not found",
      });
    }

    await galleryItem.destroy();

    res.status(200).json({
      success: true,
      message: "Gallery image deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add event impact metric
// @route   POST /api/events/:id/impact-metrics
// @access  Private/Admin
export const addEventImpactMetric = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const { label, value, icon_type, display_order } = req.body;

    const metric = await EventImpactMetric.create({
      event_id: event.id,
      label,
      value,
      icon_type: icon_type || null,
      display_order: display_order || 0,
    });

    res.status(201).json({
      success: true,
      data: metric,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get event impact metrics
// @route   GET /api/events/:id/impact-metrics
// @access  Public
export const getEventImpactMetrics = async (req, res, next) => {
  try {
    const metrics = await EventImpactMetric.findAll({
      where: { event_id: req.params.id },
      order: [["display_order", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: metrics.length,
      data: metrics,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event impact metric
// @route   DELETE /api/events/:id/impact-metrics/:metricId
// @access  Private/Admin
export const deleteEventImpactMetric = async (req, res, next) => {
  try {
    const metric = await EventImpactMetric.findByPk(req.params.metricId);

    if (!metric) {
      return res.status(404).json({
        success: false,
        message: "Impact metric not found",
      });
    }

    await metric.destroy();

    res.status(200).json({
      success: true,
      message: "Impact metric deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add event testimonial
// @route   POST /api/events/:id/testimonials
// @access  Private/Admin
export const addEventTestimonial = async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const { name, role, quote, display_order } = req.body;

    const testimonial = await EventTestimonial.create({
      event_id: event.id,
      name,
      role: role || null,
      quote,
      display_order: display_order || 0,
    });

    res.status(201).json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get event testimonials
// @route   GET /api/events/:id/testimonials
// @access  Public
export const getEventTestimonials = async (req, res, next) => {
  try {
    const testimonials = await EventTestimonial.findAll({
      where: { event_id: req.params.id },
      order: [["display_order", "ASC"]],
    });

    res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event testimonial
// @route   DELETE /api/events/:id/testimonials/:testimonialId
// @access  Private/Admin
export const deleteEventTestimonial = async (req, res, next) => {
  try {
    const testimonial = await EventTestimonial.findByPk(req.params.testimonialId);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    await testimonial.destroy();

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
