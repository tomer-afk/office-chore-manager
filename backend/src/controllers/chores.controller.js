const Chore = require('../models/Chore');
const Team = require('../models/Team');

/**
 * Get all chores for a team
 */
exports.getChores = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { assigned_to, status, priority, start_date, end_date } = req.query;

    // Verify user is a member of the team
    const isMember = await Team.isMember(teamId, req.user.id);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You are not a member of this team.',
      });
    }

    const filters = {
      assigned_to,
      status,
      priority,
      start_date,
      end_date,
      is_template: false, // Only return actual chore instances
    };

    const chores = await Chore.findByTeam(teamId, filters);

    res.json({
      success: true,
      data: { chores },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a single chore by ID
 */
exports.getChore = async (req, res, next) => {
  try {
    const { id } = req.params;

    const chore = await Chore.findById(id);

    if (!chore) {
      return res.status(404).json({
        success: false,
        error: 'Chore not found',
      });
    }

    // Verify user is a member of the team
    const isMember = await Team.isMember(chore.team_id, req.user.id);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: 'Access denied.',
      });
    }

    res.json({
      success: true,
      data: { chore },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new chore
 */
exports.createChore = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const {
      title,
      description,
      priority,
      color,
      assigned_to,
      start_date,
      due_date,
      is_recurring,
      recurrence_pattern,
      recurrence_interval,
      recurrence_days_of_week,
      recurrence_day_of_month,
      recurrence_end_date,
    } = req.body;

    // Validate required fields
    if (!title || !due_date) {
      return res.status(400).json({
        success: false,
        error: 'Title and due date are required',
      });
    }

    // Verify user is a member of the team
    const isMember = await Team.isMember(teamId, req.user.id);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You are not a member of this team.',
      });
    }

    // If recurring, validate recurrence fields
    if (is_recurring && !recurrence_pattern) {
      return res.status(400).json({
        success: false,
        error: 'Recurrence pattern is required for recurring chores',
      });
    }

    const choreData = {
      team_id: teamId,
      title,
      description,
      priority: priority || 'medium',
      color: color || '#3B82F6',
      assigned_to,
      created_by: req.user.id,
      start_date,
      due_date,
      is_recurring: is_recurring || false,
      recurrence_pattern,
      recurrence_interval,
      recurrence_days_of_week,
      recurrence_day_of_month,
      recurrence_end_date,
      is_template: is_recurring || false,
    };

    const chore = await Chore.create(choreData);

    res.status(201).json({
      success: true,
      data: { chore },
      message: 'Chore created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update a chore
 */
exports.updateChore = async (req, res, next) => {
  try {
    const { id } = req.params;

    const chore = await Chore.findById(id);

    if (!chore) {
      return res.status(404).json({
        success: false,
        error: 'Chore not found',
      });
    }

    // Verify user is a member of the team
    const isMember = await Team.isMember(chore.team_id, req.user.id);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: 'Access denied.',
      });
    }

    const updates = req.body;
    const updatedChore = await Chore.update(id, updates);

    res.json({
      success: true,
      data: { chore: updatedChore },
      message: 'Chore updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a chore
 */
exports.deleteChore = async (req, res, next) => {
  try {
    const { id } = req.params;

    const chore = await Chore.findById(id);

    if (!chore) {
      return res.status(404).json({
        success: false,
        error: 'Chore not found',
      });
    }

    // Verify user is a member of the team
    const isMember = await Team.isMember(chore.team_id, req.user.id);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: 'Access denied.',
      });
    }

    await Chore.delete(id);

    res.json({
      success: true,
      message: 'Chore deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Mark a chore as complete
 */
exports.completeChore = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;

    const chore = await Chore.findById(id);

    if (!chore) {
      return res.status(404).json({
        success: false,
        error: 'Chore not found',
      });
    }

    // Verify user is a member of the team
    const isMember = await Team.isMember(chore.team_id, req.user.id);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: 'Access denied.',
      });
    }

    const completedChore = await Chore.complete(id, req.user.id, notes);

    res.json({
      success: true,
      data: { chore: completedChore },
      message: 'Chore marked as complete',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get completion history for a chore
 */
exports.getChoreHistory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const chore = await Chore.findById(id);

    if (!chore) {
      return res.status(404).json({
        success: false,
        error: 'Chore not found',
      });
    }

    // Verify user is a member of the team
    const isMember = await Team.isMember(chore.team_id, req.user.id);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: 'Access denied.',
      });
    }

    const history = await Chore.getCompletionHistory(id);

    res.json({
      success: true,
      data: { history },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get calendar view data
 */
exports.getCalendarData = async (req, res, next) => {
  try {
    const { teamId } = req.params;
    const { start_date, end_date } = req.query;

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        error: 'Start date and end date are required',
      });
    }

    // Verify user is a member of the team
    const isMember = await Team.isMember(teamId, req.user.id);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: 'Access denied. You are not a member of this team.',
      });
    }

    const chores = await Chore.getCalendarData(teamId, start_date, end_date);

    res.json({
      success: true,
      data: { chores },
    });
  } catch (error) {
    next(error);
  }
};
