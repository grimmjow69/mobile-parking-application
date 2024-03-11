const API_BASE_URL = 'http://192.168.100.11:8080/user';

export const updateFavouriteSpot = async (userId: number, spotId: number | null): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/update-favourite-spot`, {
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
    console.error('Error updateing favourite spot:', error);
  }
};
