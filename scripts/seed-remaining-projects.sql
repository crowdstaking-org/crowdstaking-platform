-- Batch insert remaining 11 projects with profiles, missions, and proposals
-- This is much faster than sequential API calls

-- Insert remaining founder profiles
INSERT INTO profiles (wallet_address, display_name, bio, avatar_url, github_username) VALUES
('0x5a51e2ebf8d1e2e2c2f8b0f7a0a5d3e2c1b0a9f8', 'React Team', 'Building React - The library for web and native user interfaces', 'https://avatars.githubusercontent.com/u/69631', 'facebook'),
('0x6b62f3fca9e2f3f3d3a9c1a8b1b6e4f3d2c1b0a9', 'Vue.js Team', 'Building Vue.js - Progressive JavaScript framework', 'https://avatars.githubusercontent.com/u/6128107', 'vuejs'),
('0x7c73a4adb0f3a4a4e4b0d2b9c2c7f5a4e3d2c1b0', 'TensorFlow Team', 'Building TensorFlow - Open Source Machine Learning', 'https://avatars.githubusercontent.com/u/15658638', 'tensorflow'),
('0x8d84b5bee1a4b5b5f5c1e3c0d3d8a6b5f4e3d2c1', 'Kubernetes Team', 'Building Kubernetes - Production-Grade Container Orchestration', 'https://avatars.githubusercontent.com/u/13629408', 'kubernetes'),
('0x9e95c6ccf2b5c6c6a6d2f4d1e4e9b7c6a5f4e3d2', 'Next.js Team', 'Building Next.js - The React Framework', 'https://avatars.githubusercontent.com/u/14985020', 'vercel'),
('0x0f06d7dda3c6d7d7b7e3a5e2f5f0c8d7b6a5f4e3', 'Flutter Team', 'Building Flutter - Beautiful native apps', 'https://avatars.githubusercontent.com/u/14101776', 'flutter'),
('0x1a17e8eeb4d7e8e8c8f4b6f3a6a1d9e8c7b6a5f4', 'Golang Team', 'Building Go - The Go programming language', 'https://avatars.githubusercontent.com/u/4314092', 'golang'),
('0x2b28f9ffc5e8f9f9d9a5c7a4b7b2e0f9d8c7b6a5', 'Django Team', 'Building Django - Web framework for perfectionists', 'https://avatars.githubusercontent.com/u/27804', 'django'),
('0x3c39a0aad6f9a0a0e0b6d8b5c8c3f1a0e9d8c7b6', 'Rust Team', 'Building Rust - Empowering everyone to build reliable software', 'https://avatars.githubusercontent.com/u/5430905', 'rust-lang'),
('0x4d40b1bbe7a0b1b1f1c7e9c6d9d4a2b1f0e9d8c7', 'Deno Team', 'Building Deno - Modern runtime for JavaScript and TypeScript', 'https://avatars.githubusercontent.com/u/42048915', 'denoland'),
('0x5e51c2cce8b1c2c2a2d8f0d7e0e5b3c2a1f0e9d8', 'Electron Team', 'Building Electron - Cross-platform desktop apps', 'https://avatars.githubusercontent.com/u/13409222', 'electron')
ON CONFLICT (wallet_address) DO NOTHING;

-- Insert projects for these profiles
INSERT INTO projects (founder_wallet_address, name, description, token_name, token_symbol, total_supply, token_status, status) VALUES
('0x5a51e2ebf8d1e2e2c2f8b0f7a0a5d3e2c1b0a9f8', 'React', 'The library for web and native user interfaces', 'React Token', 'REAC', 1500000000, 'live', 'active'),
('0x6b62f3fca9e2f3f3d3a9c1a8b1b6e4f3d2c1b0a9', 'Vue.js', 'Progressive JavaScript framework for building UIs', 'Vue Token', 'VUE', 1200000000, 'pending', 'active'),
('0x7c73a4adb0f3a4a4e4b0d2b9c2c7f5a4e3d2c1b0', 'TensorFlow', 'Open Source Machine Learning Framework', 'TensorFlow Token', 'TENS', 2000000000, 'illiquid', 'active'),
('0x8d84b5bee1a4b5b5f5c1e3c0d3d8a6b5f4e3d2c1', 'Kubernetes', 'Production-Grade Container Orchestration platform', 'Kubernetes Token', 'K8S', 1800000000, 'pending', 'active'),
('0x9e95c6ccf2b5c6c6a6d2f4d1e4e9b7c6a5f4e3d2', 'Next.js', 'The React Framework for Production', 'Nextjs Token', 'NEXT', 1100000000, 'live', 'active'),
('0x0f06d7dda3c6d7d7b7e3a5e2f5f0c8d7b6a5f4e3', 'Flutter', 'Beautiful native apps for mobile and beyond', 'Flutter Token', 'FLT', 1300000000, 'illiquid', 'active'),
('0x1a17e8eeb4d7e8e8c8f4b6f3a6a1d9e8c7b6a5f4', 'Go', 'The Go programming language', 'Go Token', 'GO', 900000000, 'illiquid', 'active'),
('0x2b28f9ffc5e8f9f9d9a5c7a4b7b2e0f9d8c7b6a5', 'Django', 'Web framework for perfectionists with deadlines', 'Django Token', 'DJG', 800000000, 'pending', 'active'),
('0x3c39a0aad6f9a0a0e0b6d8b5c8c3f1a0e9d8c7b6', 'Rust', 'Empowering everyone to build reliable software', 'Rust Token', 'RUST', 1600000000, 'illiquid', 'active'),
('0x4d40b1bbe7a0b1b1f1c7e9c6d9d4a2b1f0e9d8c7', 'Deno', 'Modern runtime for JavaScript and TypeScript', 'Deno Token', 'DENO', 950000000, 'live', 'active'),
('0x5e51c2cce8b1c2c2a2d8f0d7e0e5b3c2a1f0e9d8', 'Electron', 'Build cross-platform desktop apps', 'Electron Token', 'ELEC', 1050000000, 'pending', 'active');


