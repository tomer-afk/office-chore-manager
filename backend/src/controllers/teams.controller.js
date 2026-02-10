const Team = require('../models/Team');
const User = require('../models/User');

/**
 * Get all teams for current user
 */
exports.getUserTeams = async (req, res, next) => {
  try {
    const teams = await Team.findByUserId(req.user.id);

    res.json({
      success: true,
      data: { teams },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new team
 */
exports.createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Team name is required',
      });
    }

    // Create team
    const team = await Team.create({
      name,
      description,
      createdBy: req.user.id,
    });

    // Add creator as admin member
    await Team.addMember(team.id, req.user.id, 'admin');

    res.status(201).json({
      success: true,
      data: { team },
      message: 'Team created successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get team by ID
 */
exports.getTeam = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user is member
    const isMember = await Team.isMember(id, req.user.id);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    const team = await Team.findById(id);
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found',
      });
    }

    res.json({
      success: true,
      data: { team },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get team members
 */
exports.getTeamMembers = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user is member
    const isMember = await Team.isMember(id, req.user.id);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    const members = await Team.getMembers(id);

    res.json({
      success: true,
      data: { members },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add member to team by email
 */
exports.addTeamMemberByEmail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { email, role = 'member' } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    // Check if requester is member
    const isMember = await Team.isMember(id, req.user.id);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found with this email. They need to register first.',
      });
    }

    // Check if user is already a member
    const isAlreadyMember = await Team.isMember(id, user.id);
    if (isAlreadyMember) {
      return res.status(400).json({
        success: false,
        error: 'User is already a member of this team',
      });
    }

    await Team.addMember(id, user.id, role);

    res.json({
      success: true,
      data: {
        member: {
          id: user.id,
          name: user.name,
          email: user.email,
          role,
        },
      },
      message: 'Member added successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Add member to team (legacy - by userId)
 */
exports.addTeamMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId, role = 'member' } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    // Check if requester is member
    const isMember = await Team.isMember(id, req.user.id);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    await Team.addMember(id, userId, role);

    res.json({
      success: true,
      message: 'Member added successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Remove member from team
 */
exports.removeTeamMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params;

    // Check if requester is member
    const isMember = await Team.isMember(id, req.user.id);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    await Team.removeMember(id, userId);

    res.json({
      success: true,
      message: 'Member removed successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update team
 */
exports.updateTeam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    // Check if user is member
    const isMember = await Team.isMember(id, req.user.id);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    const team = await Team.update(id, { name, description });

    res.json({
      success: true,
      data: { team },
      message: 'Team updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete team
 */
exports.deleteTeam = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user is member
    const isMember = await Team.isMember(id, req.user.id);
    if (!isMember) {
      return res.status(403).json({
        success: false,
        error: 'Access denied',
      });
    }

    await Team.delete(id);

    res.json({
      success: true,
      message: 'Team deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
