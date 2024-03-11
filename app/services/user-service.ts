const API_BASE_URL = 'http://192.168.100.11:8080/user';

export const updateFavoriteSpot = async (userId: number, spotId: number | null): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-favorite-spot`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId,
        spotId: spotId
      })
    });

    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error updateing favorite spot:', error);
  }
};
