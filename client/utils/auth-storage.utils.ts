export const clearAuthStorage = () => {
  try {
    localStorage.removeItem('auth-storage');
    sessionStorage.removeItem('auth-storage');
    console.log('✅ Auth storage cleared successfully');
  } catch (error) {
    console.error('❌ Failed to clear auth storage:', error);
  }
};

export const getStoredAuthData = () => {
  try {
    const data = localStorage.getItem('auth-storage');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('❌ Failed to parse auth storage:', error);
    return null;
  }
};

export const debugAuthStorage = () => {
  const data = getStoredAuthData();
  console.log('📦 Current auth storage:', data);
  
  if (data?.state?.user) {
    console.log('👤 User data structure:', {
      hasData: !!data.state.user.data,
      hasDirectFields: !!data.state.user.first_name,
      user: data.state.user,
    });
  }
  
  return data;
};
