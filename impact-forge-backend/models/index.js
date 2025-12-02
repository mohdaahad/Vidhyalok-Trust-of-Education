import User from "./User.model.js";
import Event from "./Event.model.js";
import Project from "./Project.model.js";
import Donation from "./Donation.model.js";
import Volunteer from "./Volunteer.model.js";
import ContactSubmission from "./ContactSubmission.model.js";
import NewsletterSubscription from "./NewsletterSubscription.model.js";
import EventRegistration from "./EventRegistration.model.js";
import EventTestimonial from "./EventTestimonial.model.js";
import EventImpactMetric from "./EventImpactMetric.model.js";
import EventGallery from "./EventGallery.model.js";
import EventAgenda from "./EventAgenda.model.js";
import ProjectUpdate from "./ProjectUpdate.model.js";
import ProjectGallery from "./ProjectGallery.model.js";

// Define Relationships

// User - Volunteer (One-to-One)
User.hasOne(Volunteer, { foreignKey: "user_id", as: "volunteer" });
Volunteer.belongsTo(User, { foreignKey: "user_id", as: "user" });

// Project - Donation (One-to-Many)
Project.hasMany(Donation, { foreignKey: "project_id", as: "donations" });
Donation.belongsTo(Project, { foreignKey: "project_id", as: "project" });

// Project - ProjectUpdate (One-to-Many)
Project.hasMany(ProjectUpdate, { foreignKey: "project_id", as: "updates" });
ProjectUpdate.belongsTo(Project, { foreignKey: "project_id", as: "project" });

// Project - ProjectGallery (One-to-Many)
Project.hasMany(ProjectGallery, { foreignKey: "project_id", as: "gallery" });
ProjectGallery.belongsTo(Project, { foreignKey: "project_id", as: "project" });

// Event - EventRegistration (One-to-Many)
Event.hasMany(EventRegistration, { foreignKey: "event_id", as: "registrations" });
EventRegistration.belongsTo(Event, { foreignKey: "event_id", as: "event" });

// Event - EventTestimonial (One-to-Many)
Event.hasMany(EventTestimonial, { foreignKey: "event_id", as: "testimonials" });
EventTestimonial.belongsTo(Event, { foreignKey: "event_id", as: "event" });

// Event - EventImpactMetric (One-to-Many)
Event.hasMany(EventImpactMetric, { foreignKey: "event_id", as: "impactMetrics" });
EventImpactMetric.belongsTo(Event, { foreignKey: "event_id", as: "event" });

// Event - EventGallery (One-to-Many)
Event.hasMany(EventGallery, { foreignKey: "event_id", as: "gallery" });
EventGallery.belongsTo(Event, { foreignKey: "event_id", as: "event" });

// Event - EventAgenda (One-to-Many)
Event.hasMany(EventAgenda, { foreignKey: "event_id", as: "agenda" });
EventAgenda.belongsTo(Event, { foreignKey: "event_id", as: "event" });

export {
  User,
  Event,
  Project,
  Donation,
  Volunteer,
  ContactSubmission,
  NewsletterSubscription,
  EventRegistration,
  EventTestimonial,
  EventImpactMetric,
  EventGallery,
  EventAgenda,
  ProjectUpdate,
  ProjectGallery,
};

