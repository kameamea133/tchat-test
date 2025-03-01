/**
 * Middleware to validate required fields
 * @param {Array} requiredFields - Array of required fields
 * @returns {Function} - Middleware
 */
export const validateInputs = (requiredFields) => (req, res, next) => {
    const missingFields = requiredFields.filter(field => !req.body[field]); // Vérifie les champs manquants

    if (missingFields.length > 0) {
        return res.status(400).json({
            message: `Missing required fields: ${missingFields.join(", ")}`,
        });
    }

    next(); 
};
