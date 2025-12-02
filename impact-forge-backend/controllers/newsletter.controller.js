import NewsletterSubscription from "../models/NewsletterSubscription.model.js";

// @desc    Get all newsletter subscriptions
// @route   GET /api/newsletters
// @access  Private/Admin
export const getNewsletterSubscriptions = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = status ? { status } : {};

    const subscriptions = await NewsletterSubscription.findAll({
      where,
      order: [["subscribed_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      count: subscriptions.length,
      data: subscriptions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get newsletter subscription by ID
// @route   GET /api/newsletters/:id
// @access  Private/Admin
export const getNewsletterSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await NewsletterSubscription.findByPk(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Newsletter subscription not found",
      });
    }

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Subscribe to newsletter
// @route   POST /api/newsletters/subscribe
// @access  Public
export const subscribeToNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if already subscribed
    const existingSubscription = await NewsletterSubscription.findOne({
      where: { email },
    });

    if (existingSubscription) {
      if (existingSubscription.status === "active") {
        return res.status(400).json({
          success: false,
          message: "Email is already subscribed to the newsletter",
        });
      } else {
        // Reactivate subscription
        await existingSubscription.update({ status: "active" });
        return res.status(200).json({
          success: true,
          message: "Successfully resubscribed to newsletter",
          data: existingSubscription,
        });
      }
    }

    const subscription = await NewsletterSubscription.create({
      email,
      status: "active",
    });

    res.status(201).json({
      success: true,
      message: "Successfully subscribed to newsletter",
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unsubscribe from newsletter
// @route   POST /api/newsletters/unsubscribe
// @access  Public
export const unsubscribeFromNewsletter = async (req, res, next) => {
  try {
    const { email } = req.body;

    const subscription = await NewsletterSubscription.findOne({
      where: { email },
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Email not found in newsletter subscriptions",
      });
    }

    await subscription.update({ status: "unsubscribed" });

    res.status(200).json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update newsletter subscription status
// @route   PUT /api/newsletters/:id
// @access  Private/Admin
export const updateNewsletterSubscription = async (req, res, next) => {
  try {
    const subscription = await NewsletterSubscription.findByPk(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Newsletter subscription not found",
      });
    }

    await subscription.update(req.body);

    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete newsletter subscription
// @route   DELETE /api/newsletters/:id
// @access  Private/Admin
export const deleteNewsletterSubscription = async (req, res, next) => {
  try {
    const subscription = await NewsletterSubscription.findByPk(req.params.id);

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: "Newsletter subscription not found",
      });
    }

    await subscription.destroy();

    res.status(200).json({
      success: true,
      message: "Newsletter subscription deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};


