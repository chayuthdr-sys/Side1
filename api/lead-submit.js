module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    return res.status(200).json({
      success: true,
      message: 'ระบบได้รับข้อมูลขอใบเสนอราคาเรียบร้อยแล้ว ทีมงานวิศวกรจะติดต่อกลับโดยเร็วที่สุด',
      timestamp: new Date().toISOString()
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
