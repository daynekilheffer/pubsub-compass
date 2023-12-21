import { Box, Typography } from "@mui/material";

export default function EmptyPane() {
  return <Box sx={{ p: 2, py: 4 }}>
    <Typography color="gray">Select a topic or subscription to view its messages</Typography>
  </Box>
}
