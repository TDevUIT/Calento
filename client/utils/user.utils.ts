import { User } from "@/interface/auth.interface";


export function getUserInitials(user: User | null | undefined): string {
  if (!user) return "U";
  
  const firstName = user.first_name?.trim() || "";
  const lastName = user.last_name?.trim() || "";
  
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }
  
  if (firstName) {
    return firstName.substring(0, 2).toUpperCase();
  }
  
  if (lastName) {
    return lastName.substring(0, 2).toUpperCase();
  }
  
  if (user.username) {
    return user.username.substring(0, 2).toUpperCase();
  }
  
  if (user.email) {
    return user.email.substring(0, 2).toUpperCase();
  }
  
  return "U";
}


export function getUserFullName(user: User | null | undefined): string {
  if (!user) return "Guest";
  
  if (user.full_name) {
    return user.full_name;
  }
  
  const firstName = user.first_name?.trim() || "";
  const lastName = user.last_name?.trim() || "";
  
  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  
  if (firstName) {
    return firstName;
  }
  
  if (lastName) {
    return lastName;
  }
  
  return user.username || user.email || "Guest";
}
